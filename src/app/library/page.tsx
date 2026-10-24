import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { books, uniqueValues } from "@/lib/data";
import { LibraryBrowser } from "./LibraryBrowser";

export const metadata: Metadata = {
  title: "المكتبة",
  description: "أمهات الكتب الإسلامية في الحديث والسيرة والتاريخ والتزكية، للقراءة والتحميل مجاناً.",
};

export default function LibraryPage() {
  const categories = uniqueValues(books.flatMap(book => book.categories));

  return (
    <>
      <PageHeader eyebrow="المكتبة" title="كتب للقراءة والتحميل مجاناً" subtitle="مختارات من أمهات الكتب الإسلامية لطالب العلم ولكل مسلم." />
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <LibraryBrowser books={books} categories={categories} />
      </div>
    </>
  );
}
