// NOTE: This is an unofficial, best-effort Amazon Jobs public search adapter.
// Amazon Jobs endpoints are public but can change without notice.
// A failure here will be silently skipped without breaking the page.

import { Job } from "../types";
import {
  classifyCategory,
  classifyLevel,
  cleanLocation,
  detectRemote,
  isEngineeringRole,
} from "../normalize";

interface AmazonJobItem {
  id_icims?: string;
  title?: string;
  job_path?: string;
  normalized_location?: string;
  posted_date?: string;
  is_remote?: boolean;
}

interface AmazonSearchResponse {
  jobs?: AmazonJobItem[];
}

/**
 * Fetches software engineering jobs from Amazon Jobs public search endpoint.
 * Endpoint: https://www.amazon.jobs/en/search.json?base_query=software+engineer&result_limit=50
 */
export async function fetchAmazonJobs(): Promise<Job[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url =
      "https://www.amazon.jobs/en/search.json?base_query=software+engineer&result_limit=50";

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

    const data: AmazonSearchResponse = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) {
      return [];
    }

    const jobs: Job[] = [];

    for (const item of data.jobs) {
      if (!item.title || !isEngineeringRole(item.title)) {
        continue;
      }

      const location = cleanLocation(item.normalized_location);
      const isRemote = detectRemote(item.title, location, item.is_remote);
      const jobUrl = item.job_path
        ? `https://www.amazon.jobs${item.job_path}`
        : `https://www.amazon.jobs/en/jobs/${item.id_icims || ""}`;

      jobs.push({
        id: `amzn-${item.id_icims || Math.random().toString(36).substring(7)}`,
        company: "Amazon",
        title: item.title.trim(),
        location,
        remote: isRemote,
        url: jobUrl,
        postedAt: item.posted_date,
        category: classifyCategory(item.title),
        level: classifyLevel(item.title),
      });
    }

    return jobs;
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}
