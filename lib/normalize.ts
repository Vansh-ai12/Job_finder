import { Job, JobCategory, JobLevel } from "./types";

// Patterns for non-engineering roles that should be dropped
const EXCLUDED_TITLE_KEYWORDS = [
  "recruiter",
  "recruiting",
  "talent acquisition",
  "sourcer",
  "human resources",
  "people partner",
  "sales",
  "account executive",
  "business development",
  "sales development",
  "sdr",
  "bdr",
  "account manager",
  "marketing",
  "seo",
  "content writer",
  "copywriter",
  "legal",
  "counsel",
  "attorney",
  "paralegal",
  "finance",
  "payroll",
  "accounting",
  "accountant",
  "controller",
  "billing",
  "office manager",
  "executive assistant",
  "receptionist",
  "workplace",
  "facilities",
  "culinary",
  "cook",
  "nurse",
  "customer support",
  "customer care",
  "call center",
  "public relations",
  "communications manager",
];

/**
 * Checks whether a role is technical/engineering.
 * Returns false if it clearly matches non-engineering keywords.
 */
export function isEngineeringRole(title: string): boolean {
  const lower = title.toLowerCase();

  // Explicit excludes
  for (const excluded of EXCLUDED_TITLE_KEYWORDS) {
    // Match whole-word or boundary where possible
    const regex = new RegExp(`\\b${excluded}\\b`, "i");
    if (regex.test(lower)) {
      // Exception: "sales engineer" or "solutions engineer" can be technical,
      // but pure sales/marketing/recruiting must be dropped.
      if (
        (lower.includes("sales engineer") || lower.includes("solutions engineer")) &&
        (excluded === "sales")
      ) {
        continue;
      }
      return false;
    }
  }

  // Must match at least one engineering / technical marker
  const techKeywords = [
    "engineer",
    "developer",
    "software",
    "architect",
    "research",
    "scientist",
    "ml",
    "ai",
    "data",
    "infrastructure",
    "sre",
    "devops",
    "platform",
    "security",
    "firmware",
    "hardware",
    "frontend",
    "backend",
    "fullstack",
    "ios",
    "android",
    "mobile",
    "systems",
    "nlp",
    "vision",
    "algorithm",
    "robotics",
    "technical program",
    "applied scientist",
  ];

  return techKeywords.some((kw) => lower.includes(kw));
}

/**
 * Classifies a job category from the title.
 */
export function classifyCategory(title: string): JobCategory {
  const lower = title.toLowerCase();

  // AI & Machine Learning
  if (
    lower.includes("machine learning") ||
    lower.includes("ml ") ||
    lower.includes(" ml") ||
    lower.includes("ai ") ||
    lower.includes(" ai") ||
    lower.includes("llm") ||
    lower.includes("deep learning") ||
    lower.includes("nlp") ||
    lower.includes("computer vision") ||
    lower.includes("generative ai") ||
    lower.includes("applied scientist") ||
    lower.includes("research scientist") ||
    lower.includes("research engineer") ||
    lower.includes("model ") ||
    lower.includes("neural")
  ) {
    return "AI/ML";
  }

  // Data Engineering & Analytics
  if (
    lower.includes("data engineer") ||
    lower.includes("data scientist") ||
    lower.includes("data analytics") ||
    lower.includes("analytics engineer") ||
    lower.includes("big data") ||
    lower.includes("database engineer") ||
    lower.includes("etl")
  ) {
    return "Data";
  }

  // Infrastructure, Cloud, SRE, DevOps
  if (
    lower.includes("infrastructure") ||
    lower.includes("devops") ||
    lower.includes("sre") ||
    lower.includes("site reliability") ||
    lower.includes("platform engineer") ||
    lower.includes("cloud engineer") ||
    lower.includes("systems engineer") ||
    lower.includes("hardware") ||
    lower.includes("firmware") ||
    lower.includes("network engineer")
  ) {
    return "Infra";
  }

  // Security & AppSec
  if (
    lower.includes("security") ||
    lower.includes("infosec") ||
    lower.includes("appsec") ||
    lower.includes("cryptography") ||
    lower.includes("cyber") ||
    lower.includes("soc ") ||
    lower.includes("penetration")
  ) {
    return "Security";
  }

  // Software Engineering (General, Frontend, Backend, Fullstack, Mobile)
  if (
    lower.includes("software") ||
    lower.includes("developer") ||
    lower.includes("frontend") ||
    lower.includes("front end") ||
    lower.includes("front-end") ||
    lower.includes("backend") ||
    lower.includes("back end") ||
    lower.includes("back-end") ||
    lower.includes("fullstack") ||
    lower.includes("full stack") ||
    lower.includes("full-stack") ||
    lower.includes("ios") ||
    lower.includes("android") ||
    lower.includes("mobile") ||
    lower.includes("web engineer") ||
    lower.includes("application engineer")
  ) {
    return "SWE";
  }

  return "Other";
}

/**
 * Classifies seniority level from the title.
 */
export function classifyLevel(title: string): JobLevel {
  const lower = title.toLowerCase();

  // Intern
  if (
    lower.includes("intern") ||
    lower.includes("internship") ||
    lower.includes("co-op") ||
    lower.includes("student")
  ) {
    return "Intern";
  }

  // New Grad / University / Early Career
  if (
    lower.includes("new grad") ||
    lower.includes("university graduate") ||
    lower.includes("campus") ||
    lower.includes("early career") ||
    lower.includes("entry level") ||
    lower.includes("associate software") ||
    lower.includes("rotational")
  ) {
    return "New Grad";
  }

  // Senior / Staff / Principal / Lead
  if (
    lower.includes("senior") ||
    lower.includes("sr.") ||
    lower.includes("staff") ||
    lower.includes("principal") ||
    lower.includes("lead") ||
    lower.includes("director") ||
    lower.includes("distinguished") ||
    lower.includes("head of") ||
    lower.includes("architect")
  ) {
    return "Senior";
  }

  // Mid Level
  if (
    lower.includes("mid") ||
    lower.includes("ii") ||
    lower.includes("iii") ||
    lower.includes("experienced")
  ) {
    return "Mid";
  }

  // Default to Mid if it's a standard engineer title without qualifiers
  if (
    lower.includes("software engineer") ||
    lower.includes("developer") ||
    lower.includes("research engineer")
  ) {
    return "Mid";
  }

  return "Unknown";
}

/**
 * Detects if a role is remote from title, location, or remote flag.
 */
export function detectRemote(
  title: string,
  location: string,
  explicitRemote?: boolean
): boolean {
  if (explicitRemote === true) return true;
  const combined = `${title} ${location}`.toLowerCase();
  return (
    combined.includes("remote") ||
    combined.includes("anywhere") ||
    combined.includes("virtual") ||
    combined.includes("distributed") ||
    combined.includes("work from home") ||
    combined.includes("wfh") ||
    combined.includes("telecommute")
  );
}

/**
 * Cleans location strings by trimming extra whitespace and stripping HTML.
 */
export function cleanLocation(loc?: string): string {
  if (!loc || typeof loc !== "string") return "Various Locations";
  const cleaned = loc
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || "Various Locations";
}

/**
 * Deduplicates jobs by URL and sorts them newest first.
 */
export function dedupeAndSortJobs(jobs: Job[]): Job[] {
  const seenUrls = new Set<string>();
  const uniqueJobs: Job[] = [];

  for (const job of jobs) {
    if (!job.url || seenUrls.has(job.url)) continue;
    seenUrls.add(job.url);
    uniqueJobs.push(job);
  }

  return uniqueJobs.sort((a, b) => {
    const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
    const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
    return timeB - timeA;
  });
}
