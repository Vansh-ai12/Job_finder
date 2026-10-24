// NOTE: This is an unofficial, best-effort Microsoft Careers adapter.
// Microsoft Careers search endpoint is unofficial and may change or block automated requests.
// Handled safely with an 8-second timeout and falls back gracefully to official search portals.

import { Job } from "../types";
import {
  classifyCategory,
  classifyLevel,
  cleanLocation,
  detectRemote,
  isEngineeringRole,
} from "../normalize";

interface MicrosoftJobItem {
  jobId?: string | number;
  title?: string;
  properties?: {
    primaryWorkLocation?: string;
    workSiteFlexibility?: string;
    postingDate?: string;
  };
}

interface MicrosoftSearchResponse {
  operationResult?: {
    result?: {
      jobs?: MicrosoftJobItem[];
    };
  };
}

/**
 * Fetches software engineering openings from Microsoft careers search endpoint.
 * Falls back to verified official search portal deep-links if unreachable.
 */
export async function fetchMicrosoftJobs(): Promise<Job[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url =
      "https://jobs.careers.microsoft.com/api/v1/jobs/search?q=software%20engineer&p=1&l=en_us";

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "User-Agent": "TechPulse-Aggregator/1.0",
      },
    });

    if (res.ok) {
      const data: MicrosoftSearchResponse = await res.json();
      const list = data.operationResult?.result?.jobs;
      if (Array.isArray(list) && list.length > 0) {
        const jobs: Job[] = [];
        for (const item of list) {
          if (!item.title || !isEngineeringRole(item.title)) continue;
          const loc = cleanLocation(item.properties?.primaryWorkLocation);
          const isRemote =
            item.properties?.workSiteFlexibility?.toLowerCase().includes("remote") ||
            detectRemote(item.title, loc);

          jobs.push({
            id: `msft-${item.jobId || Math.random().toString(36).substring(7)}`,
            company: "Microsoft",
            title: item.title.trim(),
            location: loc,
            remote: isRemote,
            url: `https://jobs.careers.microsoft.com/global/en/job/${item.jobId}`,
            postedAt: item.properties?.postingDate,
            category: classifyCategory(item.title),
            level: classifyLevel(item.title),
          });
        }
        if (jobs.length > 0) return jobs;
      }
    }
  } catch {
    // Silently continue to fallback
  } finally {
    clearTimeout(timeoutId);
  }

  // Fallback: Curated official Microsoft Careers search portal links
  return [
    {
      id: "msft-portal-swe",
      company: "Microsoft",
      title: "Explore Software Engineering & Cloud Careers (Official Microsoft)",
      location: "Redmond, WA & Worldwide / Remote Available",
      remote: true,
      url: "https://jobs.careers.microsoft.com/global/en/search?q=software%20engineer",
      postedAt: new Date().toISOString(),
      category: "SWE",
      level: "Mid",
    },
    {
      id: "msft-portal-ai",
      company: "Microsoft",
      title: "Explore AI & Copilot Applied Research Roles (Microsoft AI)",
      location: "Redmond, WA & Worldwide / Remote Available",
      remote: true,
      url: "https://jobs.careers.microsoft.com/global/en/search?q=artificial%20intelligence",
      postedAt: new Date().toISOString(),
      category: "AI/ML",
      level: "Senior",
    },
  ];
}
