import { Job } from "../types";
import {
  classifyCategory,
  classifyLevel,
  cleanLocation,
  detectRemote,
  isEngineeringRole,
} from "../normalize";

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  location?: {
    name?: string;
  };
  updated_at?: string;
}

interface GreenhouseResponse {
  jobs?: GreenhouseJob[];
}

/**
 * Fetches jobs from Greenhouse public boards API.
 * Endpoint: https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=false
 */
export async function fetchGreenhouseJobs(
  companyName: string,
  slug: string
): Promise<Job[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(
      slug
    )}/jobs?content=false`;

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

    const data: GreenhouseResponse = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) {
      return [];
    }

    const jobs: Job[] = [];

    for (const item of data.jobs) {
      if (!item.title || !isEngineeringRole(item.title)) {
        continue;
      }

      const location = cleanLocation(item.location?.name);
      const isRemote = detectRemote(item.title, location);

      jobs.push({
        id: `gh-${slug}-${item.id}`,
        company: companyName,
        title: item.title.trim(),
        location,
        remote: isRemote,
        url: item.absolute_url,
        postedAt: item.updated_at,
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
