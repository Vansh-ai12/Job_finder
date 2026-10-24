"use client";

import React, { useState, useMemo } from "react";
import { NewsItem } from "@/lib/types";
import { NewsCard } from "./NewsCard";

interface NewsListProps {
  initialNews: NewsItem[];
}

export function NewsList({ initialNews }: NewsListProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Top" | "AI">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("All");

  const filteredNews = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return initialNews.filter((item) => {
      // Tab filter
      if (activeTab === "Top" && item.category !== "Top") return false;
      if (activeTab === "AI" && item.category !== "AI") return false;

      // Source filter
      if (sourceFilter !== "All" && item.source !== sourceFilter) {
        return false;
      }

      // Search query
      if (q && !item.title.toLowerCase().includes(q)) {
        return false;
      }

      return true;
    });
  }, [initialNews, activeTab, sourceFilter, searchQuery]);

  return (
    <div>
      {/* Controls: Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 self-start">
          <button
            type="button"
            onClick={() => setActiveTab("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "All"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            All News
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Top")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "Top"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Top Stories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("AI")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "AI"
                ? "bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            AI & LLM
          </button>
        </div>

        {/* Search & Source filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-400">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Sources</option>
            <option value="Hacker News">Hacker News</option>
            <option value="Dev.to">Dev.to</option>
          </select>
        </div>
      </div>

      {/* News Items List */}
      {filteredNews.length > 0 ? (
        <div className="space-y-3.5">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-10 text-center my-6">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No tech news articles matching your search query.
          </p>
        </div>
      )}
    </div>
  );
}
