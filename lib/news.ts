import { NewsItem } from "./types";
import { fetchHackerNews } from "./fetchers/hackernews";
import { fetchDevToNews } from "./fetchers/devto";

/**
 * Aggregates tech news from Hacker News and Dev.to in parallel.
 * Deduplicates by URL and sorts by points / date.
 */
export async function getAllNews(category: "Top" | "AI" = "Top"): Promise<NewsItem[]> {
  const [hnResult, devtoResult] = await Promise.allSettled([
    fetchHackerNews(category),
    fetchDevToNews(category),
  ]);

  const items: NewsItem[] = [];

  if (hnResult.status === "fulfilled" && Array.isArray(hnResult.value)) {
    items.push(...hnResult.value);
  }

  if (devtoResult.status === "fulfilled" && Array.isArray(devtoResult.value)) {
    items.push(...devtoResult.value);
  }

  // Dedupe by URL
  const seenUrls = new Set<string>();
  const uniqueItems: NewsItem[] = [];

  for (const item of items) {
    if (!item.url || seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);
    uniqueItems.push(item);
  }

  // Sort by engagement (points) and recency
  return uniqueItems.sort((a, b) => {
    const pointsA = a.points || 0;
    const pointsB = b.points || 0;
    if (pointsB !== pointsA) {
      return pointsB - pointsA;
    }
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });
}
