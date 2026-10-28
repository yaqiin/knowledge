import { ArrowLeft, CalendarCheck, Lock, Target, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { QuranCard } from "./memorization/quran/QuranCard";

export const metadata: Metadata = {
  title: "زادي",
  description: "تابع حفظك للقرآن الكريم، وأنشئ جدولاً لعاداتك اليومية أو لتحدي 90 يوماً جاهزاً للطباعة بصيغة PDF أو صورة.",
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
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          <QuranCard />
          <PlannerCard
            href="/zad/habits/"
            icon={CalendarCheck}
            gradient="from-amber-400 to-amber-600"
            title="جدول العادات"
            description="اختر عاداتك وحمّل جدولاً جاهزاً للطباعة."
          />
          <PlannerCard
            wide
            href="/zad/challenge/"
            icon={Target}
            gradient="from-sky-500 to-sky-700"
            title="تحدي 90 يوماً"
            description="اكتب أهدافك، وضع علامة في مربع كل يوم."
          />
        </div>

        <p className="flex items-center justify-center gap-2 text-center text-sm text-emerald-900/50">
          <Lock className="h-4 w-4 shrink-0" />
          تُحفظ اختياراتك على جهازك فقط، ولا تحتاج إلى حساب.
        </p>
      </div>
    </>
  );
}

/** A printable planner. `wide` spans the two mobile columns as a row, then becomes a normal card from `md`. */
function PlannerCard({ href, icon: Icon, gradient, title, description, wide = false }: {
  href: string;
  icon: LucideIcon;
  gradient: string;
  title: string;
  description: string;
  wide?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex rounded-3xl border border-emerald-900/5 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-5 ${
        wide ? "col-span-2 items-center gap-4 md:col-span-1 md:flex-col md:items-stretch md:gap-0" : "flex-col"
      }`}
    >
      <span className={`flex shrink-0 items-center justify-center ${wide ? "md:mx-auto md:h-28" : "mx-auto h-20 sm:h-28"}`}>
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg sm:h-16 sm:w-16`}>
          <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
        </span>
      </span>
      <span className="flex flex-1 flex-col">
        <h2 className={`font-display text-base font-bold text-emerald-950 sm:text-lg ${wide ? "md:mt-4" : "mt-3 sm:mt-4"}`}>{title}</h2>
        <p className="mt-1 flex-1 text-xs leading-relaxed text-emerald-900/70 sm:text-sm">{description}</p>
        <span className={`inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 ${wide ? "mt-2 md:mt-4" : "mt-3 sm:mt-4"}`}>
          أنشئ جدولك
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
        </span>
      </span>
    </Link>
  );
}
