import React from "react";
import { NewsItem } from "@/lib/types";
import { timeAgo } from "@/lib/timeago";
import { Badge } from "./Badge";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  const publishedText = timeAgo(news.publishedAt);
  const isHN = news.source === "Hacker News";

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:border-indigo-500/40 dark:hover:border-indigo-400/30"
    >
      <div className="flex-1 min-w-0">
        {/* Source Badge & Timestamp */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="source">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isHN ? "bg-orange-500" : "bg-zinc-800 dark:bg-zinc-200"
              }`}
            />
            {news.source}
          </Badge>

          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {publishedText}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
          {news.title}
        </h3>

        {/* Engagement Stats: Points & Comments */}
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {typeof news.points === "number" && (
            <span className="inline-flex items-center gap-1">
              {/* Upvote icon */}
              <svg
                className="w-3.5 h-3.5 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
              {news.points} points
            </span>
          )}

          {typeof news.comments === "number" && (
            <span className="inline-flex items-center gap-1">
              {/* Comment icon */}
              <svg
                className="w-3.5 h-3.5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {news.comments} comments
            </span>
          )}

          <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline inline-flex items-center gap-0.5 ml-auto sm:ml-0 font-semibold">
            Read article
            <svg
              className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Optional Thumbnail Image */}
      {news.image && (
        <div className="hidden sm:block shrink-0 w-24 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <img
            src={news.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
    </a>
  );
}
