import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { GeometricPattern } from "@/components/GeometricPattern";
import { WheelBuilder } from "./WheelBuilder";

export const metadata: Metadata = {
  title: "عجلة الحياة",
  description: "قيّم جوانب حياتك العشرة من علاقتك بالله إلى صحتك وأسرتك، واكتشف أولوياتك، وحمّل عجلتك بصيغة PDF أو صورة.",
};

export default function WheelPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-emerald-900/5 bg-gradient-to-b from-emerald-50 to-white py-10 sm:py-14">
        <GeometricPattern className="absolute inset-0 -z-10 h-full w-full text-emerald-900/[0.05]" />
        <div className="container mx-auto px-4 sm:px-6">
          <Link href="/zad/" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">
            <ChevronRight className="h-4 w-4" />
            زادي
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-emerald-950 sm:text-5xl">عجلة الحياة</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-emerald-900/70">
            قيّم كل جانب من حياتك، فتظهر لك الجوانب التي تحتاج عنايتك. أعدها كل شهر أو في بداية رمضان وقارن.
          </p>
        </div>
      </section>

      <WheelBuilder />
    </>
  );
}
