"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, SearchInput, matches } from "@/components/Filters";
import type { Collection } from "../collections";

type Filter = "all" | "memorized" | "remaining";

/** Numbered list of a collection's items with search and memorized filters — works for any collection. */
export function ItemGrid({ collection, memorized, onToggle }: {
  collection: Collection;
  memorized: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(
    () => collection.items.filter(item =>
      (filter === "all" || (filter === "memorized") === memorized.has(item.id)) && matches(query, item.name)),
    [collection.items, filter, memorized, query],
  );

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "الكل", count: collection.items.length },
    { value: "memorized", label: "حفظتها", count: memorized.size },
    { value: "remaining", label: "لم أحفظها", count: collection.items.length - memorized.size },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder={`ابحث عن ${collection.itemLabel}...`} />
        <div className="flex gap-1 rounded-full bg-emerald-50 p-1" role="group" aria-label="تصفية">
          {filters.map(({ value, label, count }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === value ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-900/60 hover:text-emerald-900"
              }`}
            >
              {label} <span className="text-emerald-900/40">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {results.length ? (
        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
          {results.map(item => {
            const done = memorized.has(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onToggle(item.id)}
                  aria-pressed={done}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-start transition ${
                    done
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                      : "border-emerald-900/10 bg-white text-emerald-950 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    done ? "bg-white/20" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {done ? <Check className="h-4 w-4" /> : item.id}
                  </span>
                  <span className="truncate font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState onReset={() => { setQuery(""); setFilter("all"); }} />
        </div>
      )}
    </div>
  );
}
