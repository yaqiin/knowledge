import { ArrowLeft, CalendarCheck, ChartPie, Lock, Target, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { QuranCard } from "./memorization/quran/QuranCard";

export const metadata: Metadata = {
  title: "زادي",
  description: "تابع حفظك للقرآن الكريم، وأنشئ جدولاً لعاداتك اليومية أو لتحدي 90 يوماً، وقيّم عجلة حياتك، جاهزاً للطباعة بصيغة PDF أو صورة.",
};

export default function ZadPage() {
  return (
    <>
      <PageHeader
        eyebrow="﴿ وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَى ﴾"
        title="زادي"
        subtitle="تابع حفظك وعاداتك اليومية."
      />
      <div className="container mx-auto space-y-6 px-4 py-5 sm:space-y-10 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          <QuranCard />
          <PlannerCard
            href="/zad/habits/"
            icon={CalendarCheck}
            gradient="from-amber-400 to-amber-600"
            title="جدول العادات"
            description="اختر عاداتك وحمّل جدولاً جاهزاً للطباعة."
          />
          <PlannerCard
            href="/zad/challenge/"
            icon={Target}
            gradient="from-sky-500 to-sky-700"
            title="تحدي 90 يوماً"
            description="اكتب أهدافك، وضع علامة في مربع كل يوم."
          />
          <PlannerCard
            href="/zad/wheel/"
            icon={ChartPie}
            gradient="from-violet-500 to-violet-700"
            title="عجلة الحياة"
            description="قيّم جوانب حياتك واكتشف أولوياتك."
            cta="قيّم حياتك"
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

/** A printable planner: a row on mobile, a card from `md`. */
function PlannerCard({ href, icon: Icon, gradient, title, description, cta = "أنشئ جدولك" }: {
  href: string;
  icon: LucideIcon;
  gradient: string;
  title: string;
  description: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-3xl border border-emerald-900/5 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-5 md:flex-col md:items-stretch md:gap-0"
    >
      {/* Same width as the heart on the Quran card, so the texts line up */}
      <span className="flex w-16 shrink-0 items-center justify-center md:mx-auto md:h-28 md:w-auto">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg md:h-16 md:w-16`}>
          <Icon className="h-6 w-6 md:h-8 md:w-8" />
        </span>
      </span>
      <span className="flex flex-1 flex-col">
        <h2 className="font-display text-base font-bold text-emerald-950 sm:text-lg md:mt-4">{title}</h2>
        <p className="mt-1 flex-1 text-xs leading-relaxed text-emerald-900/70 sm:text-sm">{description}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 md:mt-4">
          {cta}
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
        </span>
      </span>
    </Link>
  );
}
