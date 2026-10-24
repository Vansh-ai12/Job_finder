import { CompanyConfig } from "./types";

/**
 * Curated list of top tech companies.
 * Adding a new company is a single entry in this array.
 * Each company has:
 * - name: Display name
 * - source: "greenhouse" | "lever" | "ashby" | "workday" | "amazon" | "google" | "microsoft"
 * - slug: Job board identifier for Greenhouse / Lever / Ashby
 * - tenant / wdN / site: Workday parameters for Workday companies
 * - careersUrl: Fallback URL to official search page
 * - colorFrom / colorTo: Tailwind gradient colors for company avatar & badge
 */
export const COMPANIES: CompanyConfig[] = [
  // AI & Frontier Labs
  {
    name: "OpenAI",
    source: "greenhouse",
    slug: "openai",
    careersUrl: "https://openai.com/careers/search",
    colorFrom: "from-emerald-500",
    colorTo: "to-teal-700",
  },
  {
    name: "Anthropic",
    source: "ashby",
    slug: "anthropic",
    careersUrl: "https://www.anthropic.com/careers#open-roles",
    colorFrom: "from-amber-600",
    colorTo: "to-stone-800",
  },
  {
    name: "Scale AI",
    source: "greenhouse",
    slug: "scaleai",
    careersUrl: "https://scale.com/careers",
    colorFrom: "from-purple-600",
    colorTo: "to-indigo-800",
  },
  {
    name: "Cohere",
    source: "lever",
    slug: "cohere",
    careersUrl: "https://cohere.com/careers",
    colorFrom: "from-red-500",
    colorTo: "to-rose-800",
  },
  {
    name: "Mistral AI",
    source: "ashby",
    slug: "mistral",
    careersUrl: "https://mistral.ai/jobs",
    colorFrom: "from-orange-500",
    colorTo: "to-amber-700",
  },
  {
    name: "Perplexity",
    source: "ashby",
    slug: "perplexity",
    careersUrl: "https://www.perplexity.ai/careers",
    colorFrom: "from-cyan-600",
    colorTo: "to-blue-800",
  },

  // Big Tech & Hardware Giants
  {
    name: "NVIDIA",
    source: "workday",
    tenant: "nvidia",
    wdN: "wd5",
    site: "NVIDIAExternalCareerSite",
    careersUrl: "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite",
    colorFrom: "from-green-500",
    colorTo: "to-emerald-800",
  },
  {
    name: "Amazon",
    source: "amazon",
    careersUrl: "https://www.amazon.jobs/en/search?base_query=software+engineer",
    colorFrom: "from-amber-500",
    colorTo: "to-yellow-700",
  },
  {
    name: "Google",
    source: "google",
    careersUrl: "https://www.google.com/about/careers/applications/jobs/results?q=software%20engineer",
    colorFrom: "from-blue-500",
    colorTo: "to-red-500",
  },
  {
    name: "Microsoft",
    source: "microsoft",
    careersUrl: "https://jobs.careers.microsoft.com/global/en/search?q=software%20engineer",
    colorFrom: "from-blue-600",
    colorTo: "to-cyan-500",
  },

  // Cloud, Infrastructure & Data
  {
    name: "Stripe",
    source: "greenhouse",
    slug: "stripe",
    careersUrl: "https://stripe.com/jobs/search",
    colorFrom: "from-indigo-500",
    colorTo: "to-violet-800",
  },
  {
    name: "Databricks",
    source: "greenhouse",
    slug: "databricks",
    careersUrl: "https://www.databricks.com/company/careers",
    colorFrom: "from-red-600",
    colorTo: "to-orange-700",
  },
  {
    name: "Cloudflare",
    source: "greenhouse",
    slug: "cloudflare",
    careersUrl: "https://www.cloudflare.com/careers/jobs",
    colorFrom: "from-orange-500",
    colorTo: "to-amber-600",
  },
  {
    name: "Datadog",
    source: "greenhouse",
    slug: "datadog",
    careersUrl: "https://www.datadoghq.com/careers",
    colorFrom: "from-purple-600",
    colorTo: "to-pink-700",
  },
  {
    name: "Snowflake",
    source: "greenhouse",
    slug: "snowflake",
    careersUrl: "https://careers.snowflake.com/us/en",
    colorFrom: "from-sky-400",
    colorTo: "to-blue-700",
  },
  {
    name: "Palantir",
    source: "lever",
    slug: "palantir",
    careersUrl: "https://www.palantir.com/careers",
    colorFrom: "from-neutral-700",
    colorTo: "to-zinc-950",
  },

  // Consumer, Productivity & FinTech
  {
    name: "Airbnb",
    source: "greenhouse",
    slug: "airbnb",
    careersUrl: "https://careers.airbnb.com/positions",
    colorFrom: "from-rose-500",
    colorTo: "to-pink-600",
  },
  {
    name: "Figma",
    source: "greenhouse",
    slug: "figma",
    careersUrl: "https://www.figma.com/careers",
    colorFrom: "from-violet-500",
    colorTo: "to-rose-500",
  },
  {
    name: "Coinbase",
    source: "greenhouse",
    slug: "coinbase",
    careersUrl: "https://www.coinbase.com/careers/positions",
    colorFrom: "from-blue-600",
    colorTo: "to-indigo-700",
  },
  {
    name: "Discord",
    source: "greenhouse",
    slug: "discord",
    careersUrl: "https://discord.com/careers",
    colorFrom: "from-indigo-600",
    colorTo: "to-blue-700",
  },
  {
    name: "Reddit",
    source: "greenhouse",
    slug: "reddit",
    careersUrl: "https://www.redditinc.com/careers",
    colorFrom: "from-orange-600",
    colorTo: "to-red-600",
  },
  {
    name: "Pinterest",
    source: "greenhouse",
    slug: "pinterest",
    careersUrl: "https://www.pinterestcareers.com",
    colorFrom: "from-red-600",
    colorTo: "to-rose-700",
  },
  {
    name: "Dropbox",
    source: "greenhouse",
    slug: "dropbox",
    careersUrl: "https://jobs.dropbox.com",
    colorFrom: "from-blue-500",
    colorTo: "to-indigo-600",
  },
  {
    name: "Instacart",
    source: "greenhouse",
    slug: "instacart",
    careersUrl: "https://instacart.careers",
    colorFrom: "from-emerald-600",
    colorTo: "to-green-700",
  },
  {
    name: "Notion",
    source: "ashby",
    slug: "notion",
    careersUrl: "https://www.notion.so/careers",
    colorFrom: "from-neutral-800",
    colorTo: "to-zinc-900",
  },
  // Workday Tech Giants
  {
    name: "Adobe",
    source: "workday",
    tenant: "adobe",
    wdN: "wd5",
    site: "external_experienced",
    careersUrl: "https://adobe.wd5.myworkdayjobs.com/external_experienced",
    colorFrom: "from-red-600",
    colorTo: "to-red-800",
  },
  {
    name: "Salesforce",
    source: "workday",
    tenant: "salesforce",
    wdN: "wd1",
    site: "External_Career_Site",
    careersUrl: "https://salesforce.wd1.myworkdayjobs.com/External_Career_Site",
    colorFrom: "from-sky-500",
    colorTo: "to-blue-600",
  },
];

/**
 * Returns gradient avatar styling for any company name
 */
export function getCompanyColors(companyName: string): { from: string; to: string } {
  const match = COMPANIES.find(
    (c) => c.name.toLowerCase() === companyName.toLowerCase()
  );
  if (match?.colorFrom && match?.colorTo) {
    return { from: match.colorFrom, to: match.colorTo };
  }
  // Deterministic fallback based on hash
  const fallbacks = [
    { from: "from-indigo-600", to: "to-purple-700" },
    { from: "from-cyan-600", to: "to-blue-700" },
    { from: "from-emerald-600", to: "to-teal-700" },
    { from: "from-rose-600", to: "to-pink-700" },
    { from: "from-amber-600", to: "to-orange-700" },
  ];
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = (hash << 5) - hash + companyName.charCodeAt(i);
  }
  return fallbacks[Math.abs(hash) % fallbacks.length];
}
