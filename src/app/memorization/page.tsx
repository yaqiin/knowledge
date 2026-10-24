import { Lock } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CollectionCards } from "./components/CollectionCards";

export const metadata: Metadata = {
  title: "محفوظاتي",
  description: "تابع ما حفظته من القرآن الكريم سورةً سورة، وشارك تقدمك صورةً جميلة.",
};

export default function MemorizationPage() {
  return (
    <>
      <PageHeader
        eyebrow="محفوظاتي"
        title="تابع ما حفظته"
        subtitle="سجّل ما تحفظه وراقب تقدمك، ثم شاركه صورةً جميلة."
      />
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <CollectionCards />
        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-emerald-900/50">
          <Lock className="h-4 w-4 shrink-0" />
          تُحفظ اختياراتك على جهازك فقط، ولا تحتاج إلى حساب.
        </p>
      </div>
    </>
  );
}
