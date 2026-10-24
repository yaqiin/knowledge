"use client";

import { BookOpenText, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryChips, EmptyState, SearchInput, matches } from "@/components/Filters";
import { formatNumber, type Book } from "@/lib/data";

export function LibraryBrowser({ books, categories }: { books: Book[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(
    () => books.filter(book =>
      (!category || book.categories.includes(category))
      && matches(query, book.title, book.description, ...book.authors)),
    [books, category, query],
  );

  const reset = () => {
    setQuery("");
    setCategory(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="ابحث بعنوان الكتاب أو المؤلف..." />
        <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      </div>

      <p className="mt-6 text-sm text-emerald-900/50" aria-live="polite">
        {results.length} من {books.length}
      </p>

      {results.length ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      ) : (
        <div className="mt-4"><EmptyState onReset={reset} /></div>
      )}
    </>
  );
}

function BookCard({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = book.description.length > 140;

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-emerald-900/5 bg-white shadow-sm transition hover:shadow-xl">
      <div className="flex justify-center bg-gradient-to-b from-emerald-50 to-white px-6 pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images hosted on GitHub */}
        <img
          src={book.cover}
          alt={`غلاف كتاب ${book.title}`}
          loading="lazy"
          className="h-56 w-auto rounded-lg object-contain shadow-xl shadow-emerald-900/15"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {book.categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {book.categories.map(category => (
              <span key={category} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {category}
              </span>
            ))}
          </div>
        )}
        <h2 className="font-display text-xl font-bold text-emerald-950">{book.title}</h2>
        <p className="mt-1 text-sm text-emerald-900/60">{book.authors.join("، ")}</p>

        <p className={`mt-4 leading-relaxed text-emerald-900/75 ${expanded ? "" : "line-clamp-3"}`}>
          {book.description}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="mt-1 self-start text-sm font-semibold text-emerald-700 hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? "عرض أقل" : "عرض المزيد"}
          </button>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          {book.pages ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-900/60">
              <BookOpenText className="h-4 w-4" />
              {formatNumber(book.pages)} صفحة
            </span>
          ) : <span />}
          {book.downloadLink ? (
            <a
              href={book.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Download className="h-4 w-4" />
              تحميل
            </a>
          ) : (
            <span className="text-sm text-emerald-900/40">التحميل غير متوفر</span>
          )}
        </div>
      </div>
    </article>
  );
}
