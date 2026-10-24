import { getAllJobs } from "@/lib/jobs";
import { COMPANIES } from "@/lib/companies";
import { Hero } from "./components/Hero";
import { JobList } from "./components/JobList";

export const revalidate = 3600; // 1 hour ISR caching

export default async function HomePage() {
  const jobs = await getAllJobs();

  return (
    <div>
      {/* Hero Header with Live Stats */}
      <Hero
        title="Software Engineering & AI Careers"
        subtitle="Hand-curated, real-time job openings from top tier tech giants and frontier AI labs. No middleman, no sponsored clutter."
        totalJobs={jobs.length}
        totalCompanies={COMPANIES.length}
        lastUpdatedText="1h ISR"
        badgeText="Live Big-Tech Careers Feed"
      />

      {/* Filterable Job List */}
      <JobList initialJobs={jobs} />
    </div>
  );
}
