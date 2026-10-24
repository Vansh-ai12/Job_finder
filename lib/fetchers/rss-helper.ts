import { NewsItem, NewsSource } from "../types";

export function decodeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, "-")
    .replace(/&#8230;/g, "...")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .trim();
}

const TECH_REGEX =
  /\b(ai|llm|gpt|openai|anthropic|claude|gemini|deepmind|nvidia|google|apple|microsoft|meta|amazon|linux|unix|windows|macos|ios|android|rust|python|javascript|typescript|golang|react|vue|node|docker|k8s|kubernetes|security|vulnerability|exploit|cve|database|sql|postgres|api|web|browser|compiler|cpu|gpu|chip|server|cloud|aws|azure|algorithm|robot|robotics|quantum|kernel|git|crypto|network|protocol|system|engineering|software|hardware|code|coding|dev|developer|semiconductor|app|apps|tech|technology|gadget|gadgets|phone|smartphone|laptop|pc|amd|intel|firmware|cybersecurity|hacker|patch|telecom|broadband|cables|startups|saas|fintech|infra)\b/i;

const NON_TECH_EXCLUDE_REGEX =
  /\b(rugs|rug|mattress|sale|discount|deal|deals|coupon|wardrobe|bedding|kitchen|pillow|sofa|trailer|box office|movie review|album review|fashion|clothing|celebrity|horoscope|lottery)\b/i;

export function isTechStory(title: string, categories: string[] = []): boolean {
  const catText = categories.join(" ").toLowerCase();
  const titleText = title.toLowerCase();

  if (NON_TECH_EXCLUDE_REGEX.test(titleText) || NON_TECH_EXCLUDE_REGEX.test(catText)) {
    return false;
  }

  return TECH_REGEX.test(titleText) || TECH_REGEX.test(catText);
}

export function isAIStory(title: string, categories: string[] = []): boolean {
  const text = `${title} ${categories.join(" ")}`.toLowerCase();
  return /\b(ai|llm|gpt|openai|anthropic|claude|gemini|deepmind|nvidia|artificial intelligence|machine learning|neural|diffusion|copilot|chatgpt)\b/i.test(
    text
  );
}

export function parseRssOrAtom(
  xml: string,
  source: NewsSource,
  options?: {
    defaultCategory?: "Top" | "AI";
    enforceTechOnly?: boolean;
  }
): NewsItem[] {
  const isAtom = xml.includes("<feed") && xml.includes("<entry");
  const items: NewsItem[] = [];
  const enforceTech = options?.enforceTechOnly ?? true;

  if (isAtom) {
    const entryRegex = /<entry[\s\S]*?<\/entry>/gi;
    let match: RegExpExecArray | null;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[0];
      const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const linkMatch =
        entry.match(/<link[^>]+href=["']([^"']+)["']/i) ||
        entry.match(/<link>([\s\S]*?)<\/link>/i);
      const dateMatch = entry.match(
        /<(?:published|updated)>([\s\S]*?)<\/(?:published|updated)>/i
      );

      const catMatches = [
        ...entry.matchAll(/<category[^>]+term=["']([^"']+)["']/gi),
      ].map((m) => m[1]);

      const title = decodeHtml(titleMatch ? titleMatch[1] : "");
      const link = linkMatch ? (linkMatch[1] || "").trim() : "";
      const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString();

      if (title && link) {
        if (enforceTech && !isTechStory(title, catMatches)) {
          continue;
        }

        const isAI = isAIStory(title, catMatches);
        const itemCategory =
          options?.defaultCategory === "AI" || isAI ? "AI" : "Top";

        const hash = Buffer.from(link).toString("base64").slice(-10);
        items.push({
          id: `${source.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${hash}`,
          title,
          url: link,
          source,
          publishedAt: date,
          category: itemCategory,
        });
      }
    }
  } else {
    const itemRegex = /<item[\s\S]*?<\/item>/gi;
    let match: RegExpExecArray | null;
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[0];
      const titleMatch = item.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const linkMatch = item.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      const dateMatch = item.match(
        /<(?:pubDate|dc:date)>([\s\S]*?)<\/(?:pubDate|dc:date)>/i
      );
      const imgMatch =
        item.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
        item.match(/<enclosure[^>]+url=["']([^"']+)["']/i) ||
        item.match(/<img[^>]+src=["']([^"']+)["']/i);

      const catMatches = [
        ...item.matchAll(
          /<category[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/gi
        ),
      ].map((m) => m[1]);

      const title = decodeHtml(titleMatch ? titleMatch[1] : "");
      const link = (linkMatch ? linkMatch[1] : "").trim();
      const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
      const image = imgMatch ? imgMatch[1] : undefined;

      if (title && link) {
        if (enforceTech && !isTechStory(title, catMatches)) {
          continue;
        }

        const isAI = isAIStory(title, catMatches);
        const itemCategory =
          options?.defaultCategory === "AI" || isAI ? "AI" : "Top";

        const hash = Buffer.from(link).toString("base64").slice(-10);
        items.push({
          id: `${source.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${hash}`,
          title,
          url: link,
          source,
          publishedAt: date,
          image,
          category: itemCategory,
        });
      }
    }
  }

  return items;
}
