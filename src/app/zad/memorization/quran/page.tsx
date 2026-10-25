import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { GeometricPattern } from "@/components/GeometricPattern";
import { QURAN } from "../collections";
import { QuranTracker } from "./QuranTracker";

export const metadata: Metadata = {
  title: "محفوظاتي من القرآن الكريم",
  description: "حدّد السور التي حفظتها على قلب مصمم من سور القرآن الكريم، تابع تقدمك، وحمّل صورة محفوظاتك.",
};

export default function QuranMemorizationPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-emerald-900/5 bg-gradient-to-b from-emerald-50 to-white py-10 sm:py-14">
        <GeometricPattern className="absolute inset-0 -z-10 h-full w-full text-emerald-900/[0.05]" />
        <div className="container mx-auto px-4 sm:px-6">
          <Link href="/zad/" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">
            <ChevronRight className="h-4 w-4" />
            زادي
          </Link>
          <p className="mt-4 text-sm font-semibold text-amber-600">﴿ بَلْ هُوَ آيَاتٌ بَيِّنَاتٌ فِي صُدُورِ الَّذِينَ أُوتُوا الْعِلْمَ ﴾</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-emerald-950 sm:text-5xl">{QURAN.title}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-emerald-900/70">{QURAN.description}</p>
        </div>
      </section>

      <QuranTracker />
    </>
  );
}
