"use client";

import { Check, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { matches } from "@/components/Filters";
import { useDismiss } from "@/lib/useDismiss";
import { SURAHS } from "./surahs";

/** Find a surah on the heart: picking a result brings it into view and outlines it (it doesn't mark it). */
export function SurahSearch({ memorized, onPick }: { memorized: Set<string>; onPick: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setQuery("");
  useDismiss(ref, Boolean(query), close);

  const results = query.trim() ? SURAHS.filter(s => matches(query, s.name)).slice(0, 8) : [];

  return (
    <div ref={ref} className="relative w-full sm:max-w-xs">
      <label className="relative block">
        <span className="sr-only">ابحث عن سورة في القلب</span>
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث عن سورة في القلب..."
          autoComplete="off"
          className="w-full rounded-full border border-emerald-900/10 bg-white py-2.5 pe-10 ps-11 text-sm text-emerald-950 shadow-sm outline-none transition placeholder:text-emerald-900/40 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={close} aria-label="مسح البحث"
            className="absolute end-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-emerald-900/50 hover:bg-emerald-50">
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      {query.trim() && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-2xl border border-emerald-900/5 bg-white p-2 shadow-2xl">
          {results.length ? (
            <ul>
              {results.map(({ id, name }) => {
                const done = memorized.has(id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => { onPick(id); close(); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm transition hover:bg-emerald-50"
                    >
                      <span className="w-6 text-xs text-emerald-900/40">{id}</span>
                      <span className="flex-1 font-medium text-emerald-950">سورة {name}</span>
                      {done && <Check className="h-4 w-4 text-emerald-600" aria-label="محفوظة" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-3 py-2 text-sm text-emerald-900/50">لا توجد نتائج</p>
          )}
        </div>
      )}
    </div>
  );
}
