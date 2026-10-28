"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { QURAN, collectionHref } from "../collections";
import { useMemorized } from "../../storage";
import { ProgressBar, progressText } from "../components/ProgressBar";
import { QuranHeart } from "./QuranHeart";

/** Hub card for the Quran: a static preview of the heart with the visitor's progress. A row on mobile, a card from `md`. */
export function QuranCard() {
  const { memorized } = useMemorized(QURAN.slug);
  const total = QURAN.items.length;

  return (
    <Link
      href={collectionHref(QURAN.slug)}
      className="group flex items-center gap-4 rounded-3xl border border-emerald-900/5 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-5 md:flex-col md:items-stretch md:gap-0"
    >
      <QuranHeart memorized={memorized} className="pointer-events-none h-20 w-16 shrink-0 md:mx-auto md:h-28 md:w-full" />
      <span className="flex min-w-0 flex-1 flex-col">
        <h2 className="font-display text-base font-bold text-emerald-950 sm:text-lg md:mt-4">محفوظاتي من القرآن</h2>
        <p className="mt-1 flex-1 text-xs leading-relaxed text-emerald-900/70 sm:text-sm">حدّد السور التي حفظتها على قلب القرآن.</p>

        <span className="mt-2 block md:mt-4">
          <span className="mb-1.5 block text-xs text-emerald-900/60 sm:text-sm md:mb-2">حفظت {progressText(memorized.size, total, QURAN.itemForms)}</span>
          <ProgressBar count={memorized.size} total={total} label={`تقدم الحفظ في ${QURAN.title}`} />
        </span>

        <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 md:mt-4">
          {memorized.size > 0 ? "تابع الحفظ" : "ابدأ"}
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
        </span>
      </span>
    </Link>
  );
}
