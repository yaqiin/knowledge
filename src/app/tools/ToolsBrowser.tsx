"use client";

import { BookOpenText, Globe, GraduationCap, HandHeart, Landmark, Monitor, Puzzle, Smartphone, Wrench } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { CategoryChips, EmptyState, SearchInput, matches } from "@/components/Filters";
import type { Tool, ToolCategory, ToolPlatform } from "@/lib/data";

/** Keyed by the ids in `tool-categories.json`; a category without an icon falls back to the wrench. */
const CATEGORY_ICONS: Record<string, typeof Wrench> = {
  "quran": BookOpenText,
  "prayer-adhkar": HandHeart,
  "hajj-umrah": Landmark,
  "educative-program": GraduationCap,
};

/** The platform filter: chips appear in this order, and only for groups that have tools. */
const PLATFORM_GROUPS: Record<string, { name: string; icon: typeof Wrench }> = {
  mobile: { name: "هاتف", icon: Smartphone },
  desktop: { name: "حاسوب", icon: Monitor },
  browser: { name: "متصفح", icon: Puzzle },
  web: { name: "ويب", icon: Globe },
};

const PLATFORMS: Record<ToolPlatform, { label: string; group: string }> = {
  android: { label: "Google Play", group: "mobile" },
  ios: { label: "App Store", group: "mobile" },
  windows: { label: "ويندوز", group: "desktop" },
  mac: { label: "ماك", group: "desktop" },
  linux: { label: "لينكس", group: "desktop" },
  chrome: { label: "Chrome", group: "browser" },
  firefox: { label: "Firefox", group: "browser" },
  edge: { label: "Edge", group: "browser" },
  web: { label: "الموقع", group: "web" },
  telegram: { label: "تيليجرام", group: "web" },
};

const inGroup = (tool: Tool, group: string) => tool.links.some(link => PLATFORMS[link.platform].group === group);

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="shrink-0 text-sm font-medium text-emerald-900/60 sm:w-16">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function ToolsBrowser({ tools, categories }: { tools: Tool[]; categories: ToolCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [platformGroup, setPlatformGroup] = useState<string | null>(null);

  const platformGroups = useMemo(
    () => Object.keys(PLATFORM_GROUPS).filter(group => tools.some(tool => inGroup(tool, group))),
    [tools],
  );

  const results = useMemo(
    () => tools.filter(tool =>
      (!category || tool.category === category)
      && (!platformGroup || inGroup(tool, platformGroup))
      && matches(query, tool.name, tool.description),
    ),
    [tools, category, platformGroup, query],
  );

  const categoryName = (id: string) => categories.find(c => c.id === id)?.name;

  const reset = () => {
    setQuery("");
    setCategory(null);
    setPlatformGroup(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchInput value={query} onChange={setQuery} placeholder="ابحث عن أداة..." />
        <FilterRow label="الموضوع">
          <CategoryChips
            categories={categories.map(c => c.id)}
            selected={category}
            onSelect={setCategory}
            getLabel={id => categoryName(id) ?? id}
          />
        </FilterRow>
        <FilterRow label="المنصة">
          <CategoryChips
            categories={platformGroups}
            selected={platformGroup}
            onSelect={setPlatformGroup}
            getLabel={group => PLATFORM_GROUPS[group].name}
          />
        </FilterRow>
      </div>

      {results.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(tool => {
            const Icon = CATEGORY_ICONS[tool.category] || Wrench;
            const name = categoryName(tool.category);
            return (
              <article
                key={tool.id}
                className="flex flex-col rounded-3xl border border-emerald-900/5 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </span>
                  {name && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">{name}</span>
                  )}
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-emerald-950">{tool.name}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-emerald-900/70">{tool.description}</p>
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
                        aria-label={`${tool.name}: ${label}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-700 hover:bg-emerald-700 hover:text-white"
                      >
                        <PlatformIcon className="h-4 w-4" />
                        {label}
                      </a>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8"><EmptyState onReset={reset} /></div>
      )}
    </>
  );
}
