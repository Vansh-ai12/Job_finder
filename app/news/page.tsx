import { getAllNews } from "@/lib/news";
import { Hero } from "../components/Hero";
import { NewsList } from "../components/NewsList";

export const revalidate = 900; // 15 minutes ISR caching

export default async function NewsPage() {
  const news = await getAllNews("Top");

  return (
    <div>
      <Hero
        title="Live Tech & AI News Pulse"
        subtitle="Real-time discussions and top stories from Hacker News and Dev.to. Filtered for high-signal engineering and AI breakthroughs."
        totalJobs={news.length}
        totalCompanies={2}
        lastUpdatedText="15m ISR"
        badgeText="Real-time Community Feeds"
      />

      <NewsList initialNews={news} />
    </div>
  );
}
