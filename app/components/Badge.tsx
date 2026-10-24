import React from "react";
import { JobCategory, JobLevel } from "@/lib/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "category"
    | "level"
    | "remote"
    | "location"
    | "source";
  category?: JobCategory;
  level?: JobLevel;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  category,
  level,
  className = "",
}: BadgeProps) {
  let colorClasses =
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700/60";

  if (variant === "category" && category) {
    switch (category) {
      case "AI/ML":
        colorClasses =
          "bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50";
        break;
      case "Data":
        colorClasses =
          "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50";
        break;
      case "Infra":
        colorClasses =
          "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50";
        break;
      case "Security":
        colorClasses =
          "bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50";
        break;
      case "SWE":
        colorClasses =
          "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50";
        break;
      default:
        colorClasses =
          "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-700/60";
    }
  } else if (variant === "level" && level) {
    switch (level) {
      case "Intern":
        colorClasses =
          "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50";
        break;
      case "New Grad":
        colorClasses =
          "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/50";
        break;
      case "Senior":
        colorClasses =
          "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50";
        break;
      case "Mid":
        colorClasses =
          "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50";
        break;
      default:
        colorClasses =
          "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/40";
    }
  } else if (variant === "remote") {
    colorClasses =
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60";
  } else if (variant === "location") {
    colorClasses =
      "bg-zinc-100/80 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700/50";
  } else if (variant === "source") {
    colorClasses =
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/50";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
}
