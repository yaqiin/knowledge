import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { GeometricPattern } from "@/components/GeometricPattern";
import { HabitsBuilder } from "./HabitsBuilder";

export const metadata: Metadata = {
  title: "جدول العادات",
  description: "أنشئ جدولاً لعباداتك وعاداتك اليومية لمدة شهر أو أسبوع، وحمّله بصيغة PDF أو صورة جاهزاً للطباعة.",
};

export default function HabitsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-emerald-900/5 bg-gradient-to-b from-emerald-50 to-white py-10 sm:py-14">
        <GeometricPattern className="absolute inset-0 -z-10 h-full w-full text-emerald-900/[0.05]" />
        <div className="container mx-auto px-4 sm:px-6">
          <Link href="/zad/" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">
            <ChevronRight className="h-4 w-4" />
            زادي
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-emerald-950 sm:text-5xl">جدول العادات</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-emerald-900/70">
            اختر عاداتك، ثم حمّل جدولاً جاهزاً للطباعة. اطبعه وضع علامة في كل يوم تلتزم فيه.
          </p>
        </div>
      </section>

      <HabitsBuilder />
    </>
  );
}
