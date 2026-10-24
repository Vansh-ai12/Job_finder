import { NewsItem } from "../types";
import { parseRssOrAtom } from "./rss-helper";

/**
 * Fetches latest tech news from The Verge's official feed.
 * Filtered strictly for technology, hardware, gadgets, and software stories.
 */
export async function fetchTheVergeNews(
  category: "Top" | "AI" = "Top"
): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://www.theverge.com/rss/index.xml", {
      signal: controller.signal,
      next: { revalidate: 900 },
      headers: {
        Accept: "application/atom+xml, application/xml, text/xml",
        "User-Agent": "TechPulse-Aggregator/1.0",
      },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const items = parseRssOrAtom(xml, "The Verge", {
      defaultCategory: category,
      enforceTechOnly: true,
    });

    if (category === "AI") {
      return items.filter((item) => item.category === "AI");
    }

    return items;
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}
