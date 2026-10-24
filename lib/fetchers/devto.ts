import { NewsItem } from "../types";

interface DevToArticle {
  id: number;
  title: string;
  url: string;
  public_reactions_count?: number;
  comments_count?: number;
  published_at?: string;
  cover_image?: string;
  social_image?: string;
}

/**
 * Fetches top trending tech articles from Dev.to public API.
 * Endpoint: https://dev.to/api/articles
 */
export async function fetchDevToNews(category: "Top" | "AI" = "Top"): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    let url = "https://dev.to/api/articles?top=1&per_page=15";
    if (category === "AI") {
      url = "https://dev.to/api/articles?tag=ai&top=1&per_page=15";
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

    const data: DevToArticle[] = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }

    const news: NewsItem[] = [];

    for (const item of data) {
      if (!item.title || !item.url) continue;

      news.push({
        id: `devto-${item.id}`,
        title: item.title,
        url: item.url,
        source: "Dev.to",
        points: item.public_reactions_count || 0,
        comments: item.comments_count || 0,
        publishedAt: item.published_at || new Date().toISOString(),
        image: item.cover_image || item.social_image,
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
