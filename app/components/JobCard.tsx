import React from "react";
import { Job } from "@/lib/types";
import { getCompanyColors } from "@/lib/companies";
import { timeAgo } from "@/lib/timeago";
import { Badge } from "./Badge";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const brandColors = getCompanyColors(job.company);
  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : "T";
  const postedText = timeAgo(job.postedAt);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-indigo-500/40 dark:hover:border-indigo-400/30">
      <div>
        {/* Top row: Company Avatar + Name & Relative Date */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {/* Company Avatar with brand gradient */}
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${brandColors.from} ${brandColors.to} flex items-center justify-center text-white font-extrabold text-lg shadow-sm shrink-0`}
              aria-hidden="true"
            >
              {companyInitial}
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                {job.company}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {postedText}
              </p>
            </div>
          </div>

          {/* Level Badge on top right */}
          {job.level && job.level !== "Unknown" && (
            <Badge variant="level" level={job.level}>
              {job.level}
            </Badge>
          )}
        </div>

        {/* Job Title */}
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-3">
          {job.title}
        </h3>

        {/* Metadata badges: Category, Remote, Location */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          <Badge variant="category" category={job.category}>
            {job.category}
          </Badge>

          {job.remote && (
            <Badge variant="remote">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Remote
            </Badge>
          )}

          <Badge variant="location">
            {/* Location pin icon */}
            <svg
              className="w-3.5 h-3.5 text-zinc-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate max-w-[200px]" title={job.location}>
              {job.location}
            </span>
          </Badge>
        </div>
      </div>

      {/* Card Footer: Apply Action */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          Verified source
        </span>

        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-sm shadow-indigo-600/20 hover:shadow-md hover:shadow-indigo-600/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span>Apply</span>
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
