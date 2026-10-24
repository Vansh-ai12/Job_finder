// NOTE: This is an unofficial, best-effort Workday public CXS adapter.
// Workday endpoints do not require authentication for public career boards,
// but their schema or rate limits may change without notice. Failures are handled safely.

import { Job } from "../types";
import {
  classifyCategory,
  classifyLevel,
  cleanLocation,
  detectRemote,
  isEngineeringRole,
} from "../normalize";

interface WorkdayJobItem {
  title: string;
  externalPath: string;
  locationsText?: string;
  postedOn?: string;
  bulletFields?: string[];
}

interface WorkdayResponse {
  jobPostings?: WorkdayJobItem[];
  total?: number;
}

/**
 * Fetches jobs from Workday public CXS endpoint for a company tenant.
 * Uses search queries like "software engineer", "machine learning" in parallel.
 */
export async function fetchWorkdayJobs(
  companyName: string,
  tenant: string,
  wdN: string = "wd5",
  site: string
): Promise<Job[]> {
  const searchQueries = ["software engineer", "machine learning"];
  const allJobs: Job[] = [];

  const fetchForQuery = async (query: string): Promise<Job[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const url = `https://${tenant}.${wdN}.myworkdayjobs.com/wday/cxs/${tenant}/${site}/jobs`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (TechPulse-Aggregator/1.0)",
        },
        body: JSON.stringify({
          appliedFacets: {},
          limit: 20,
          offset: 0,
          searchText: query,
        }),
        signal: controller.signal,
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        return [];
      }

      const data: WorkdayResponse = await res.json();
      if (!data.jobPostings || !Array.isArray(data.jobPostings)) {
        return [];
      }

      const jobs: Job[] = [];

      for (const item of data.jobPostings) {
        if (!item.title || !isEngineeringRole(item.title)) {
          continue;
        }

        const location = cleanLocation(item.locationsText);
        const isRemote = detectRemote(item.title, location);

        // Build canonical Workday job URL
        const jobUrl = `https://${tenant}.${wdN}.myworkdayjobs.com/en-US/${site}${item.externalPath}`;

        jobs.push({
          id: `wd-${tenant}-${item.externalPath.replace(/[^a-zA-Z0-9]/g, "-")}`,
          company: companyName,
          title: item.title.trim(),
          location,
          remote: isRemote,
          url: jobUrl,
          postedAt: item.postedOn,
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
  };

  const results = await Promise.allSettled(
    searchQueries.map((q) => fetchForQuery(q))
  );

  for (const res of results) {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      allJobs.push(...res.value);
    }
  }

  return allJobs;
}
