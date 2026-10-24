"use client";

import React from "react";
import { JobCategory, JobLevel } from "@/lib/types";

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCompany: string;
  setSelectedCompany: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
  remoteOnly: boolean;
  setRemoteOnly: (val: boolean) => void;
  locationQuery: string;
  setLocationQuery: (val: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalFiltered: number;
  companiesList: string[];
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Categories", value: "" },
  { label: "AI / ML", value: "AI/ML" },
  { label: "SWE", value: "SWE" },
  { label: "Data", value: "Data" },
  { label: "Infra", value: "Infra" },
  { label: "Security", value: "Security" },
];

const LEVELS: { label: string; value: string }[] = [
  { label: "All Levels", value: "" },
  { label: "Intern", value: "Intern" },
  { label: "New Grad", value: "New Grad" },
  { label: "Mid", value: "Mid" },
  { label: "Senior", value: "Senior" },
];

export function Filters({
  searchQuery,
  setSearchQuery,
  selectedCompany,
  setSelectedCompany,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
  remoteOnly,
  setRemoteOnly,
  locationQuery,
  setLocationQuery,
  onClearFilters,
  hasActiveFilters,
  totalFiltered,
  companiesList,
}: FiltersProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 p-4 sm:p-6 shadow-sm mb-8 backdrop-blur-xs">
      {/* Top Search Bars Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
        {/* Keyword Search */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <svg
              className="w-4 h-4"
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
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles (e.g. AI, Fullstack, PyTorch)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Company Dropdown */}
        <div className="md:col-span-4 relative">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="">All Companies ({companiesList.length})</option>
            {companiesList.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-400">
            <svg
              className="w-4 h-4"
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
          </div>
        </div>

        {/* Location Search */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <svg
              className="w-4 h-4"
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
          </div>
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Location filter..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Pill Filter Chips Row: Category, Level & Remote Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/70">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Chips */}
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1">
            Category:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Remote Only Switch */}
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Remote Only
          </span>
        </label>
      </div>

      {/* Seniority Chips & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/70">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1">
            Level:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((lvl) => {
              const isActive = selectedLevel === lvl.value;
              return (
                <button
                  key={lvl.label}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter results info + Clear button */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Showing <strong className="text-zinc-900 dark:text-white">{totalFiltered}</strong> openings
          </span>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
