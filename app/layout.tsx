import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "TechPulse — Fresh Tech Jobs & News Aggregator",
  description:
    "Live, zero-config Software Engineering and AI/ML job openings from top tech companies (NVIDIA, OpenAI, Anthropic, Google, Stripe, etc.) plus real-time tech news.",
  keywords: [
    "Tech Jobs",
    "Software Engineer Jobs",
    "AI Jobs",
    "Machine Learning Careers",
    "NVIDIA Jobs",
    "OpenAI Careers",
    "Hacker News",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Inline script to prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('techpulse-theme');
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xs py-10 mt-16 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                TechPulse Aggregator
              </span>
              <p className="text-center md:text-left">
                Aggregating direct public ATS boards (Greenhouse, Lever, Ashby, Workday).
                No database, zero environment variables, 100% Vercel compatible.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-500 dark:text-zinc-400">
              <span>Data cached hourly via Next.js ISR</span>
              <span>•</span>
              <span>Built with Next.js 15 & Tailwind</span>
              <span>•</span>
              <span className="text-zinc-400 dark:text-zinc-500">
                Independent project — not affiliated with listed companies
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
