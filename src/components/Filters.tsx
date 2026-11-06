"use client";

import { Search } from "lucide-react";
import type { ReactNode } from "react";

export function SearchInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block w-full sm:max-w-sm">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40" />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-emerald-900/10 bg-white py-3 pe-4 ps-11 text-emerald-950 shadow-sm outline-none transition placeholder:text-emerald-900/40 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

/**
 * A search box and dropdowns in one row, pinned just under the sticky site header (h-16 plus its 1px border, so 65px).
 * From `sm` the whole row is sticky. On phones `contents` dissolves it, so only the dropdowns stay pinned and the search scrolls away.
 */
export function FilterBar({ search, children }: { search: ReactNode; children: ReactNode }) {
  return (
    <div className="max-sm:contents sm:sticky sm:top-[65px] sm:z-40 sm:-mx-6 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:bg-white/90 sm:px-6 sm:py-3 sm:backdrop-blur-xl">
      {search}
      <div className="grid shrink-0 auto-cols-fr grid-flow-col gap-2 max-sm:sticky max-sm:top-[65px] max-sm:z-40 max-sm:-mx-4 max-sm:mt-2 max-sm:bg-white/90 max-sm:px-4 max-sm:py-2 max-sm:backdrop-blur-xl sm:flex">
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-900/15 py-16 text-center">
      <p className="text-emerald-900/60">لا توجد نتائج مطابقة.</p>
      <button type="button" onClick={onReset} className="mt-3 text-sm font-semibold text-emerald-700 hover:underline">
        إعادة ضبط البحث
      </button>
    </div>
  );
}

/** Case-insensitive match that also ignores Arabic diacritics (tashkeel). */
export function matches(query: string, ...fields: (string | null | undefined)[]): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[ً-ْٰ]/g, "").trim();
  const q = normalize(query);
  return !q || fields.some(field => field && normalize(field).includes(q));
}
