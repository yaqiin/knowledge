import { ArrowLeft, CalendarCheck, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { QuranCard } from "./memorization/quran/QuranCard";

export const metadata: Metadata = {
  title: "زادي",
  description: "تابع حفظك للقرآن الكريم، وأنشئ جدولاً لعاداتك اليومية جاهزاً للطباعة بصيغة PDF أو صورة.",
};

export default function ZadPage() {
  return (
    <>
      <PageHeader
        eyebrow="﴿ وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَى ﴾"
        title="زادي"
        subtitle="تابع حفظك وعاداتك اليومية."
      />
      <div className="container mx-auto space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:gap-5">
          <QuranCard />

          <Link
            href="/zad/habits/"
            className="group flex flex-col rounded-3xl border border-emerald-900/5 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-5"
          >
            <span className="mx-auto flex h-20 items-center justify-center sm:h-28">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg sm:h-16 sm:w-16">
                <CalendarCheck className="h-6 w-6 sm:h-8 sm:w-8" />
              </span>
            </span>
            <h2 className="mt-3 font-display text-base font-bold text-emerald-950 sm:mt-4 sm:text-lg">جدول العادات</h2>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-emerald-900/70 sm:text-sm">
              اختر عاداتك وحمّل جدولاً جاهزاً للطباعة.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 sm:mt-4">
              أنشئ جدولك
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            </span>
          </Link>
        </div>

        <p className="flex items-center justify-center gap-2 text-center text-sm text-emerald-900/50">
          <Lock className="h-4 w-4 shrink-0" />
          تُحفظ اختياراتك على جهازك فقط، ولا تحتاج إلى حساب.
        </p>
      </div>
    </>
  );
}
