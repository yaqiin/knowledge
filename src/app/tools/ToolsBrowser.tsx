"use client";

import { useMemo, useState } from "react";
import { EmptyState, SearchInput, matches } from "@/components/Filters";
import { arabicCount, type Tool, type ToolCategory } from "@/lib/data";
import { FilterSelect } from "./FilterSelect";
import { PLATFORMS, PLATFORM_GROUPS, inGroup } from "./platforms";
import { ToolCard } from "./ToolCard";

export function ToolsBrowser({ tools, categories }: { tools: Tool[]; categories: ToolCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [platformGroup, setPlatformGroup] = useState<string | null>(null);

  const categoryName = (id: string) => categories.find(c => c.id === id)?.name;

  const platformOptions = useMemo(
    () => Object.keys(PLATFORM_GROUPS)
      .filter(group => tools.some(tool => inGroup(tool, group)))
      .map(group => ({ id: group, name: PLATFORM_GROUPS[group].name })),
    [tools],
  );

  const results = tools.filter(tool =>
    (!category || tool.category === category)
    && (!platformGroup || inGroup(tool, platformGroup))
    && matches(query, tool.name, tool.description, categoryName(tool.category), ...tool.links.map(link => PLATFORMS[link.platform].label)),
  );

  const reset = () => {
    setQuery("");
    setCategory(null);
    setPlatformGroup(null);
  };

  return (
    <>
      {/*
        Pinned just under the sticky site header (h-16 plus its 1px border, so 65px).
        From `sm` the whole row is sticky. On phones `contents` dissolves it, so only the dropdowns stay pinned and the search scrolls away.
      */}
      <div className="max-sm:contents sm:sticky sm:top-[65px] sm:z-40 sm:-mx-6 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:bg-white/90 sm:px-6 sm:py-3 sm:backdrop-blur-xl">
        <SearchInput value={query} onChange={setQuery} placeholder="ابحث عن أداة أو منصة..." />
        <div className="grid shrink-0 grid-cols-2 gap-2 max-sm:sticky max-sm:top-[65px] max-sm:z-40 max-sm:-mx-4 max-sm:mt-2 max-sm:bg-white/90 max-sm:px-4 max-sm:py-2 max-sm:backdrop-blur-xl sm:flex">
          <FilterSelect label="الموضوع" allLabel="كل المواضيع" options={categories} value={category} onChange={setCategory} />
          <FilterSelect label="المنصة" allLabel="كل المنصات" options={platformOptions} value={platformGroup} onChange={setPlatformGroup} />
        </div>
      </div>

      {results.length ? (
        <>
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <p aria-live="polite" className="text-emerald-900/60">
              {arabicCount(results.length, { one: "أداة واحدة", two: "أداتان", few: "أدوات", many: "أداة" })}
            </p>
            {(query || category || platformGroup) && (
              <button type="button" onClick={reset} className="font-semibold text-emerald-700 hover:underline">
                مسح الفلاتر
              </button>
            )}
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(tool => (
              <ToolCard key={tool.id} tool={tool} categoryName={categoryName(tool.category)} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8"><EmptyState onReset={reset} /></div>
      )}
    </>
  );
}
