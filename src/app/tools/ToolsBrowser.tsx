"use client";

import { ArrowUpLeft, GraduationCap, Puzzle, Smartphone, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryChips, EmptyState, SearchInput, matches } from "@/components/Filters";
import type { Tool } from "@/lib/data";

const CATEGORY_ICONS: Record<string, typeof Wrench> = {
  "تطبيق هاتف": Smartphone,
  "إضافة متصفح": Puzzle,
  "برامج تعليمية": GraduationCap,
};

export function ToolsBrowser({ tools, categories }: { tools: Tool[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(
    () => tools.filter(tool => (!category || tool.category === category) && matches(query, tool.name, tool.description)),
    [tools, category, query],
  );

  const reset = () => {
    setQuery("");
    setCategory(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="ابحث عن أداة..." />
        <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      </div>

      {results.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(tool => {
            const Icon = (tool.category && CATEGORY_ICONS[tool.category]) || Wrench;
            return (
              <a
                key={tool.id}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-3xl border border-emerald-900/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  {tool.category && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">{tool.category}</span>
                  )}
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-emerald-950">{tool.name}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-emerald-900/70">{tool.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                  فتح الأداة
                  <ArrowUpLeft className="h-4 w-4 transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="mt-8"><EmptyState onReset={reset} /></div>
      )}
    </>
  );
}
