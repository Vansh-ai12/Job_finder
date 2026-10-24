import { COMPANIES } from "./companies";
import { dedupeAndSortJobs } from "./normalize";
import { Job } from "./types";
import { fetchGreenhouseJobs } from "./fetchers/greenhouse";
import { fetchLeverJobs } from "./fetchers/lever";
import { fetchAshbyJobs } from "./fetchers/ashby";
import { fetchWorkdayJobs } from "./fetchers/workday";
import { fetchAmazonJobs } from "./fetchers/amazon";
import { fetchGoogleJobs } from "./fetchers/google";
import { fetchMicrosoftJobs } from "./fetchers/microsoft";

/**
 * Fetches jobs across all configured companies in parallel.
 * Each company request runs in its own settled promise so failures never block others.
 * Deduplicates by URL and sorts by newest first.
 */
export async function getAllJobs(): Promise<Job[]> {
  const fetchTasks: Promise<Job[]>[] = [];

  for (const company of COMPANIES) {
    switch (company.source) {
      case "greenhouse":
        if (company.slug) {
          fetchTasks.push(fetchGreenhouseJobs(company.name, company.slug));
        }
        break;

      case "lever":
        if (company.slug) {
          fetchTasks.push(fetchLeverJobs(company.name, company.slug));
        }
        break;

      case "ashby":
        if (company.slug) {
          fetchTasks.push(fetchAshbyJobs(company.name, company.slug));
        }
        break;

      case "workday":
        if (company.tenant && company.site) {
          fetchTasks.push(
            fetchWorkdayJobs(
              company.name,
              company.tenant,
              company.wdN || "wd5",
              company.site
            )
          );
        }
        break;

      case "amazon":
        fetchTasks.push(fetchAmazonJobs());
        break;

      case "google":
        fetchTasks.push(fetchGoogleJobs());
        break;

      case "microsoft":
        fetchTasks.push(fetchMicrosoftJobs());
        break;

      default:
        break;
    }
  }

  const results = await Promise.allSettled(fetchTasks);
  const collectedJobs: Job[] = [];

  for (const res of results) {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      collectedJobs.push(...res.value);
    }
  }

  return dedupeAndSortJobs(collectedJobs);
}
