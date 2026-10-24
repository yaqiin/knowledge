import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { tools, uniqueValues } from "@/lib/data";
import { ToolsBrowser } from "./ToolsBrowser";

export const metadata: Metadata = {
  title: "الأدوات",
  description: "تطبيقات هاتف وإضافات متصفح وبرامج تعليمية مختارة للمسلم ولطالب العلم.",
};

export default function ToolsPage() {
  const categories = uniqueValues(tools.map(tool => tool.category));

  return (
    <>
      <PageHeader eyebrow="الأدوات" title="أدوات مفيدة للمسلم ولطالب العلم" subtitle="تطبيقات وإضافات وبرامج تعليمية اخترناها لتعينك على التعلم والعبادة." />
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <ToolsBrowser tools={tools} categories={categories} />
      </div>
    </>
  );
}
