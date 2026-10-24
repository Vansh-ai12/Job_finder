import { Job } from "../types";
import {
  classifyCategory,
  classifyLevel,
  cleanLocation,
  detectRemote,
  isEngineeringRole,
} from "../normalize";

interface LeverPosting {
  id: string;
  text: string;
  hostedUrl: string;
  createdAt?: number;
  workplaceType?: string;
  categories?: {
    location?: string;
    team?: string;
    commitment?: string;
  };
}

/**
 * Fetches jobs from Lever public postings API.
 * Endpoint: https://api.lever.co/v0/postings/{slug}?mode=json
 */
export async function fetchLeverJobs(
  companyName: string,
  slug: string
): Promise<Job[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `https://api.lever.co/v0/postings/${encodeURIComponent(
      slug
    )}?mode=json`;

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "User-Agent": "TechPulse-Aggregator/1.0",
      },
    });

    if (!res.ok) {
      return [];
    }

    const data: LeverPosting[] = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }

    const jobs: Job[] = [];

    for (const item of data) {
      if (!item.text || !isEngineeringRole(item.text)) {
        continue;
      }

      const location = cleanLocation(item.categories?.location);
      const isExplicitRemote =
        item.workplaceType?.toLowerCase() === "remote" ||
        item.categories?.location?.toLowerCase().includes("remote");
      const isRemote = detectRemote(item.text, location, isExplicitRemote);

      let postedAt: string | undefined;
      if (item.createdAt && typeof item.createdAt === "number") {
        postedAt = new Date(item.createdAt).toISOString();
      }

      jobs.push({
        id: `lever-${slug}-${item.id}`,
        company: companyName,
        title: item.text.trim(),
        location,
        remote: isRemote,
        url: item.hostedUrl,
        postedAt,
        category: classifyCategory(item.text),
        level: classifyLevel(item.text),
      });
    }

    return jobs;
  } catch {
    // Silently skip any network failures or timeouts
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}
