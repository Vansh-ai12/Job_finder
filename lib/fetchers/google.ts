// NOTE: This is an unofficial, best-effort Google Careers search adapter.
// Google does not offer an official public API for their careers site.
// This adapter tries public search endpoints and falls back safely to official
// deep-link search portals so the page never breaks and no fake jobs are invented.

import { Job } from "../types";
import {
  classifyCategory,
  classifyLevel,
  cleanLocation,
  detectRemote,
  isEngineeringRole,
} from "../normalize";

interface GoogleJobItem {
  id?: string;
  title?: string;
  locations?: Array<{ display?: string }>;
  apply_url?: string;
  publish_date?: string;
}

interface GoogleSearchResponse {
  jobs?: GoogleJobItem[];
}

/**
 * Fetches Google software engineering jobs via public search endpoints.
 * Falls back to curated official career search portal deep-links if the endpoint is unreachable.
 */
export async function fetchGoogleJobs(): Promise<Job[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url =
      "https://careers.google.com/api/v3/search/?q=software%20engineer&page_size=20";

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "User-Agent": "TechPulse-Aggregator/1.0",
      },
    });

    if (res.ok) {
      const data: GoogleSearchResponse = await res.json();
      if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
        const jobs: Job[] = [];
        for (const item of data.jobs) {
          if (!item.title || !isEngineeringRole(item.title)) continue;
          const loc = cleanLocation(item.locations?.[0]?.display);
          jobs.push({
            id: `goog-${item.id || Math.random().toString(36).substring(7)}`,
            company: "Google",
            title: item.title.trim(),
            location: loc,
            remote: detectRemote(item.title, loc),
            url:
              item.apply_url ||
              `https://www.google.com/about/careers/applications/jobs/results/${item.id}`,
            postedAt: item.publish_date,
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

  // Fallback: Return curated official portal cards pre-filtered for SWE and AI/ML
  return [
    {
      id: "goog-portal-swe",
      company: "Google",
      title: "Explore All Software Engineering Roles (Official Careers)",
      location: "Mountain View, CA & Global / Hybrid",
      remote: true,
      url: "https://www.google.com/about/careers/applications/jobs/results?q=software%20engineer",
      postedAt: new Date().toISOString(),
      category: "SWE",
      level: "Mid",
    },
    {
      id: "goog-portal-aiml",
      company: "Google",
      title: "Explore Machine Learning & AI Research Roles (Google DeepMind)",
      location: "Mountain View, CA / London, UK / Hybrid",
      remote: true,
      url: "https://www.google.com/about/careers/applications/jobs/results?q=machine%20learning",
      postedAt: new Date().toISOString(),
      category: "AI/ML",
      level: "Senior",
    },
  ];
}
