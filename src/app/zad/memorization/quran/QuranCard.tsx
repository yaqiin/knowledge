"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { QURAN, collectionHref } from "../collections";
import { useMemorized } from "../../storage";
import { ProgressBar, progressText } from "../components/ProgressBar";
import { QuranHeart } from "./QuranHeart";

/** Hub card for the Quran: a static preview of the heart with the visitor's progress. */
export function QuranCard() {
  const { memorized } = useMemorized(QURAN.slug);
  const total = QURAN.items.length;

  return (
    <Link
      href={collectionHref(QURAN.slug)}
      className="group flex flex-col rounded-3xl border border-emerald-900/5 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-5"
    >
      <QuranHeart memorized={memorized} className="pointer-events-none mx-auto h-20 w-full sm:h-28" />
      <h2 className="mt-3 font-display text-base font-bold text-emerald-950 sm:mt-4 sm:text-lg">محفوظاتي من القرآن</h2>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-emerald-900/70 sm:text-sm">حدّد السور التي حفظتها على قلب القرآن.</p>

      <div className="mt-3 sm:mt-4">
        <p className="mb-2 text-xs text-emerald-900/60 sm:text-sm">حفظت {progressText(memorized.size, total, QURAN.itemForms)}</p>
        <ProgressBar count={memorized.size} total={total} label={`تقدم الحفظ في ${QURAN.title}`} />
      </div>

      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 sm:mt-4">
        {memorized.size > 0 ? "تابع الحفظ" : "ابدأ"}
        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
