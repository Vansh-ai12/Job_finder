"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Job } from "@/lib/types";
import { JobCard } from "./JobCard";
import { Filters } from "./Filters";

interface JobListProps {
  initialJobs: Job[];
}

const PAGE_SIZE = 24;

function JobListContent({ initialJobs }: JobListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [selectedCompany, setSelectedCompany] = useState(
    searchParams.get("company") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get("level") || ""
  );
  const [remoteOnly, setRemoteOnly] = useState(
    searchParams.get("remote") === "true"
  );
  const [locationQuery, setLocationQuery] = useState(
    searchParams.get("location") || ""
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Sync state changes back to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCompany) params.set("company", selectedCompany);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedLevel) params.set("level", selectedLevel);
    if (remoteOnly) params.set("remote", "true");
    if (locationQuery.trim()) params.set("location", locationQuery.trim());

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Replace URL without reloading
    window.history.replaceState(null, "", targetUrl);
  }, [
    searchQuery,
    selectedCompany,
    selectedCategory,
    selectedLevel,
    remoteOnly,
    locationQuery,
    pathname,
  ]);

  // Extract distinct list of companies for filter dropdown
  const companiesList = useMemo(() => {
    const set = new Set<string>();
    for (const job of initialJobs) {
      if (job.company) set.add(job.company);
    }
    return Array.from(set).sort();
  }, [initialJobs]);

  // Check if any filters are currently active
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      selectedCompany ||
      selectedCategory ||
      selectedLevel ||
      remoteOnly ||
      locationQuery.trim()
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCompany("");
    setSelectedCategory("");
    setSelectedLevel("");
    setRemoteOnly(false);
    setLocationQuery("");
    setVisibleCount(PAGE_SIZE);
  };

  // Filter jobs client-side
  const filteredJobs = useMemo(() => {
    const qLower = searchQuery.toLowerCase().trim();
    const locLower = locationQuery.toLowerCase().trim();

    return initialJobs.filter((job) => {
      // Company filter
      if (
        selectedCompany &&
        job.company.toLowerCase() !== selectedCompany.toLowerCase()
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory && job.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel && job.level !== selectedLevel) {
        return false;
      }

      // Remote filter
      if (remoteOnly && !job.remote) {
        return false;
      }

      // Location search
      if (locLower && !job.location.toLowerCase().includes(locLower)) {
        return false;
      }

      // Text query match (title, company, or location)
      if (qLower) {
        const matchesTitle = job.title.toLowerCase().includes(qLower);
        const matchesComp = job.company.toLowerCase().includes(qLower);
        const matchesLoc = job.location.toLowerCase().includes(qLower);
        if (!matchesTitle && !matchesComp && !matchesLoc) {
          return false;
        }
      }

      return true;
    });
  }, [
    initialJobs,
    searchQuery,
    selectedCompany,
    selectedCategory,
    selectedLevel,
    remoteOnly,
    locationQuery,
  ]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  const hasMore = visibleCount < filteredJobs.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div>
      {/* Client-side filter controls */}
      <Filters
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          setVisibleCount(PAGE_SIZE);
        }}
        selectedCompany={selectedCompany}
        setSelectedCompany={(val) => {
          setSelectedCompany(val);
          setVisibleCount(PAGE_SIZE);
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(val) => {
          setSelectedCategory(val);
          setVisibleCount(PAGE_SIZE);
        }}
        selectedLevel={selectedLevel}
        setSelectedLevel={(val) => {
          setSelectedLevel(val);
          setVisibleCount(PAGE_SIZE);
        }}
        remoteOnly={remoteOnly}
        setRemoteOnly={(val) => {
          setRemoteOnly(val);
          setVisibleCount(PAGE_SIZE);
        }}
        locationQuery={locationQuery}
        setLocationQuery={(val) => {
          setLocationQuery(val);
          setVisibleCount(PAGE_SIZE);
        }}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalFiltered={filteredJobs.length}
        companiesList={companiesList}
      />

      {/* Grid of Job Cards */}
      {displayedJobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12 mb-8">
              <button
                type="button"
                onClick={handleLoadMore}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>Load More Openings ({filteredJobs.length - visibleCount} remaining)</span>
                <svg
                  className="w-4 h-4 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center my-8 bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            No matching engineering jobs found
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
            Try adjusting your search keywords, broadening your location, or
            clearing applied category filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export function JobList(props: JobListProps) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 animate-pulse"
            />
          ))}
        </div>
      }
    >
      <JobListContent {...props} />
    </Suspense>
  );
}
