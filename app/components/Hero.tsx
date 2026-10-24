import React from "react";

interface HeroProps {
  totalJobs: number;
  totalCompanies: number;
  lastUpdatedText?: string;
  badgeText?: string;
  title: string;
  subtitle: string;
}

export function Hero({
  totalJobs,
  totalCompanies,
  lastUpdatedText = "Just now",
  badgeText = "Vercel-Ready • Zero Env Variables",
  title,
  subtitle,
}: HeroProps) {
  return (
    <div className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14">
      {/* Subtle Radial Glow / Background Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 mb-5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          {badgeText}
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          {subtitle}
        </p>

        {/* Live Counters */}
        <div className="inline-grid grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-sm p-3 shadow-xs">
          <div className="px-4 sm:px-6 text-center">
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {totalJobs > 0 ? totalJobs.toLocaleString() : "250+"}
            </div>
            <div className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Open Positions
            </div>
          </div>

          <div className="px-4 sm:px-6 text-center">
            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
              {totalCompanies}
            </div>
            <div className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Tech Giants
            </div>
          </div>

          <div className="px-4 sm:px-6 text-center">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {lastUpdatedText}
            </div>
            <div className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Last Synced
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
