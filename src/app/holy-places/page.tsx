import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { holyPlaces } from "@/lib/data";
import { HolyPlacesBrowser } from "./HolyPlacesBrowser";

export const metadata: Metadata = {
  title: "المقدسات والمعالم الإسلامية",
  description: "تعرّف على تاريخ المسجد الحرام والمسجد النبوي والمسجد الأقصى وغيرها من المعالم الإسلامية حول العالم.",
};

export default function HolyPlacesPage() {
  return (
    <>
      <PageHeader eyebrow="المقدسات والمعالم" title="مقدسات المسلمين ومعالمهم" subtitle="رحلة في تاريخ المساجد الكبرى والمعالم الإسلامية حول العالم." />
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <HolyPlacesBrowser places={holyPlaces} />
      </div>
    </>
  );
}
