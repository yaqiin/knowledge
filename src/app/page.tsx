import { ArrowLeft, ArrowUpLeft, BookHeart, BookOpen, BookOpenText, Landmark, MapPin, Wrench } from "lucide-react";
import Link from "next/link";
import { COLLECTIONS } from "@/app/memorization/collections";
import { GeometricPattern } from "@/components/GeometricPattern";
import { HolyPlaceCard } from "@/components/HolyPlaceCard";
import { arabicCount, books, holyPlaces, tools } from "@/lib/data";
import { LINKS } from "@/lib/links";

const SECTIONS = [
  {
    href: "/library/",
    icon: BookOpen,
    title: "المكتبة",
    description: "أمهات الكتب الإسلامية في الحديث والسيرة والتاريخ والتزكية، للتحميل مجاناً.",
    count: arabicCount(books.length, { one: "كتاب واحد", two: "كتابان", few: "كتب", many: "كتاباً" }),
    accent: "from-emerald-500 to-emerald-700",
  },
  {
    href: "/holy-places/",
    icon: Landmark,
    title: "المقدسات والمعالم",
    description: "تعرّف على تاريخ المساجد الكبرى والمعالم الإسلامية حول العالم.",
    count: arabicCount(holyPlaces.length, { one: "معلم واحد", two: "معلمان", few: "معالم", many: "معلماً" }),
    accent: "from-amber-400 to-amber-600",
  },
  {
    href: "/tools/",
    icon: Wrench,
    title: "الأدوات",
    description: "تطبيقات وإضافات وبرامج تعليمية مختارة للمسلم ولطالب العلم.",
    count: arabicCount(tools.length, { one: "أداة واحدة", two: "أداتان", few: "أدوات", many: "أداة" }),
    accent: "from-sky-500 to-sky-700",
  },
  {
    href: "/memorization/",
    icon: BookHeart,
    title: "محفوظاتي",
    description: "تابع ما حفظته من القرآن الكريم سورةً سورة، وشارك تقدمك صورةً جميلة.",
    count: COLLECTIONS.length === 1
      ? COLLECTIONS[0].title
      : arabicCount(COLLECTIONS.length, { one: "مجموعة واحدة", two: "مجموعتان", few: "مجموعات", many: "مجموعة" }),
    accent: "from-rose-500 to-rose-700",
  },
];

const EXTERNAL = [
  { href: LINKS.quran, icon: BookOpenText, title: "القرآن الكريم", description: "منصة لقراءة القرآن الكريم بتجربة سلسة وسريعة." },
  { href: LINKS.yaqiin, icon: MapPin, title: "يقين للمساجد", description: "اعرف أين تُقام الدروس وحلقات التحفيظ في مساجد منطقتك." },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white pb-16 pt-16 sm:pt-24">
        <GeometricPattern className="absolute inset-0 -z-10 h-full w-full text-emerald-900/[0.06]" />
        <div className="absolute -top-40 start-1/2 -z-10 h-[28rem] w-[28rem] rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="container mx-auto px-4 text-center sm:px-6">
          <span className="inline-flex rounded-full border border-emerald-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur">
            من منظومة يقين
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-black leading-[1.35] text-emerald-950 sm:text-6xl">
            معرفة إسلامية{" "}
            <span className="bg-gradient-to-l from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              في متناول الجميع
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-emerald-900/70">
            مكتبة كتب مجانية، تعريف بالمقدسات والمعالم الإسلامية، وأدوات مختارة تعينك على التعلم.
          </p>
        </div>

        <div className="container mx-auto mt-14 grid gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {SECTIONS.map(({ href, icon: Icon, title, description, count, accent }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-3xl border border-emerald-900/5 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-emerald-950">{title}</h2>
                <span className="text-sm font-medium text-emerald-900/50">{count}</span>
              </div>
              <p className="mt-3 leading-relaxed text-emerald-900/70">{description}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                تصفّح
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-emerald-950 sm:text-3xl">من المقدسات والمعالم</h2>
          <Link href="/holy-places/" className="shrink-0 text-sm font-semibold text-emerald-700 hover:underline">
            عرض الكل
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {holyPlaces.slice(0, 3).map(place => (
            <HolyPlaceCard key={place.slug} place={place} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-emerald-950 sm:text-3xl">مشاريع أخرى من يقين</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {EXTERNAL.map(({ href, icon: Icon, title, description }) => (
            <a
              key={href}
              href={href}
              className="group flex items-center gap-5 rounded-3xl border border-emerald-900/5 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-xl"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-emerald-950">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-emerald-900/70">{description}</p>
              </div>
              <ArrowUpLeft className="h-5 w-5 shrink-0 text-emerald-900/30 transition group-hover:text-emerald-700" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
