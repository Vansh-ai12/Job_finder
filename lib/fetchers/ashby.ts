import { Job } from "../types";
import {
  classifyCategory,
  classifyLevel,
  cleanLocation,
  detectRemote,
  isEngineeringRole,
} from "../normalize";

interface AshbyJob {
  id: string;
  title: string;
  jobUrl: string;
  location?: string;
  isRemote?: boolean;
  publishedAt?: string;
  department?: string;
}

interface AshbyResponse {
  jobs?: AshbyJob[];
}

/**
 * Fetches jobs from Ashby public job-board API.
 * Endpoint: https://api.ashbyhq.com/posting-api/job-board/{slug}
 */
export async function fetchAshbyJobs(
  companyName: string,
  slug: string
): Promise<Job[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(
      slug
    )}`;

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

    const data: AshbyResponse = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) {
      return [];
    }

    const jobs: Job[] = [];

    for (const item of data.jobs) {
      if (!item.title || !isEngineeringRole(item.title)) {
        continue;
      }

      const location = cleanLocation(item.location);
      const isRemote = detectRemote(item.title, location, item.isRemote);

      jobs.push({
        id: `ashby-${slug}-${item.id}`,
        company: companyName,
        title: item.title.trim(),
        location,
        remote: isRemote,
        url: item.jobUrl,
        postedAt: item.publishedAt,
        category: classifyCategory(item.title),
        level: classifyLevel(item.title),
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
