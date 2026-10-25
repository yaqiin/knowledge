import { ArrowLeft, CalendarCheck, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CollectionCards } from "./memorization/components/CollectionCards";

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
        subtitle="تابع حفظك وعاداتك اليومية، وشارك تقدمك صورةً جميلة."
      />
      <div className="container mx-auto space-y-14 px-4 py-12 sm:px-6">
        <section>
          <h2 className="font-display text-2xl font-bold text-emerald-950">محفوظاتي</h2>
          <p className="mt-1 text-emerald-900/60">حدّد ما حفظته وتابع تقدمك.</p>
          <div className="mt-6">
            <CollectionCards />
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-emerald-950">جدول العادات</h2>
          <p className="mt-1 text-emerald-900/60">جدول جاهز للطباعة لمتابعة عباداتك وعاداتك اليومية.</p>
          <Link
            href="/zad/habits/"
            className="group mt-6 flex flex-col gap-5 rounded-3xl border border-emerald-900/5 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:flex-row sm:items-center"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg">
              <CalendarCheck className="h-7 w-7" />
            </span>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-emerald-950">أنشئ جدول عاداتك</h3>
              <p className="mt-1 leading-relaxed text-emerald-900/70">
                اختر عاداتك من القائمة أو أضف عاداتك الخاصة، ثم حمّل الجدول بصيغة PDF أو صورة.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
              أنشئ جدولك
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            </span>
          </Link>
        </section>

        <p className="flex items-center justify-center gap-2 text-center text-sm text-emerald-900/50">
          <Lock className="h-4 w-4 shrink-0" />
          تُحفظ اختياراتك على جهازك فقط، ولا تحتاج إلى حساب.
        </p>
      </div>
    </>
  );
}
