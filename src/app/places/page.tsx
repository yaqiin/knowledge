import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { places } from "@/lib/data";
import { PlacesBrowser } from "./PlacesBrowser";

export const metadata: Metadata = {
  title: "المعالم الإسلامية",
  description: "تعرّف على تاريخ المسجد الحرام والمسجد النبوي والمسجد الأقصى وغيرها من المعالم الإسلامية حول العالم.",
};

export default function PlacesPage() {
  return (
    <>
      <PageHeader eyebrow="المعالم" title="معالم المسلمين حول العالم" subtitle="رحلة في تاريخ المساجد الكبرى والمعالم الإسلامية حول العالم." />
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <PlacesBrowser places={places} />
      </div>
    </>
  );
}
