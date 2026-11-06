"use client";

import { Baby, BookOpenText, GraduationCap, HandHeart, Landmark, Wrench } from "lucide-react";
import { useState } from "react";
import type { Tool } from "@/lib/data";
import { PLATFORMS, PLATFORM_GROUPS } from "./platforms";

/** Keyed by the ids in `tool-categories.json`; a category without an icon falls back to the wrench. */
const CATEGORY_ICONS: Record<string, typeof Wrench> = {
  "quran": BookOpenText,
  "prayer-adhkar": HandHeart,
  "hajj-umrah": Landmark,
  "educative-program": GraduationCap,
  "kids": Baby,
};

/** Roughly what fits in the three lines a collapsed description shows. */
const COLLAPSED_LENGTH = 135;

export function ToolCard({ tool, categoryName }: { tool: Tool; categoryName?: string }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CATEGORY_ICONS[tool.category] || Wrench;
  const isLong = tool.description.length > COLLAPSED_LENGTH;

  return (
    <article className="flex flex-col rounded-3xl border border-emerald-900/5 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-6 w-6" />
        </span>
        {categoryName && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">{categoryName}</span>
        )}
      </div>
      <h2 className="mt-5 font-display text-xl font-bold text-emerald-950">{tool.name}</h2>
      <div className="mt-2 flex-1">
        <p className={`leading-relaxed text-emerald-900/70 ${isLong && !expanded ? "line-clamp-3" : ""}`}>{tool.description}</p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="mt-1 text-sm font-medium text-emerald-700 hover:underline"
          >
            {expanded ? "عرض أقل" : "عرض المزيد"}
          </button>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {tool.links.map(link => {
          const { label, group } = PLATFORMS[link.platform];
          const PlatformIcon = PLATFORM_GROUPS[group].icon;
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tool.name}: ${label} (يفتح في نافذة جديدة)`}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-emerald-900/10 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <PlatformIcon className="h-4 w-4" />
              {label}
            </a>
          );
        })}
      </div>
    </article>
  );
}
