"use client";

import { Search } from "lucide-react";

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

export function CategoryChips({ categories, selected, onSelect }: {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}) {
  const chip = (label: string, value: string | null) => {
    const active = selected === value;
    return (
      <button
        key={label}
        type="button"
        onClick={() => onSelect(value)}
        aria-pressed={active}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          active
            ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
            : "border border-emerald-900/10 bg-white text-emerald-900/70 hover:border-emerald-300 hover:text-emerald-900"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {chip("الكل", null)}
      {categories.map(category => chip(category, category))}
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
