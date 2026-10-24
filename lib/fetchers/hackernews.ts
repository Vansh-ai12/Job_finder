import { NewsItem } from "../types";

interface HNHit {
  objectID: string;
  title?: string;
  url?: string;
  points?: number;
  num_comments?: number;
  created_at?: string;
}

interface HNResponse {
  hits?: HNHit[];
}

/**
 * Fetches top or AI-focused tech news from Hacker News Algolia search API.
 * Endpoint: https://hn.algolia.com/api/v1/search
 */
export async function fetchHackerNews(category: "Top" | "AI" = "Top"): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    let url = "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=25";
    if (category === "AI") {
      url =
        "https://hn.algolia.com/api/v1/search?query=AI%20OR%20LLM%20OR%20NVIDIA%20OR%20OpenAI&tags=story&hitsPerPage=25";
    }

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 900 }, // 15 minutes cache
      headers: {
        Accept: "application/json",
        "User-Agent": "TechPulse-Aggregator/1.0",
      },
    });

    if (!res.ok) {
      return [];
    }

    const data: HNResponse = await res.json();
    if (!data.hits || !Array.isArray(data.hits)) {
      return [];
    }

    const news: NewsItem[] = [];

    for (const item of data.hits) {
      if (!item.title) continue;

      const articleUrl =
        item.url || `https://news.ycombinator.com/item?id=${item.objectID}`;

      news.push({
        id: `hn-${item.objectID}`,
        title: item.title,
        url: articleUrl,
        source: "Hacker News",
        points: item.points || 0,
        comments: item.num_comments || 0,
        publishedAt: item.created_at || new Date().toISOString(),
        category,
      });
    }

    return news;
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}
