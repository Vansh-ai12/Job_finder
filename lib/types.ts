export type JobCategory = "SWE" | "AI/ML" | "Data" | "Infra" | "Security" | "Other";
export type JobLevel = "Intern" | "New Grad" | "Mid" | "Senior" | "Unknown";

export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  remote: boolean;
  url: string;
  postedAt?: string;
  category: JobCategory;
  level: JobLevel;
}

export type CompanySource =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "workday"
  | "amazon"
  | "google"
  | "microsoft";

export interface CompanyConfig {
  name: string;
  source: CompanySource;
  slug?: string;
  tenant?: string;
  wdN?: string;
  site?: string;
  careersUrl?: string;
  colorFrom?: string;
  colorTo?: string;
}

export type NewsSource =
  | "The Verge"
  | "TechCrunch"
  | "Ars Technica"
  | "Wired"
  | "Hacker News";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: NewsSource | string;
  points?: number;
  comments?: number;
  publishedAt: string;
  image?: string;
  category?: "Top" | "AI";
}

export interface JobFiltersState {
  query: string;
  company: string;
  category: string;
  level: string;
  remoteOnly: boolean;
  location: string;
}
