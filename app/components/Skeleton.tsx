import React from "react";

export function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>

        <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm animate-pulse flex gap-4">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-5 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="flex gap-4">
          <div className="h-3 w-14 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 w-14 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl hidden sm:block shrink-0" />
    </div>
  );
}
