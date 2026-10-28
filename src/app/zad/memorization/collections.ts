import type { CountForms } from "@/lib/data";
import { SURAHS } from "./quran/surahs";

export interface MemorizationItem {
  /** Stable id stored in the visitor's browser — never change it once published */
  id: string;
  name: string;
}

/**
 * A set of texts a visitor can track memorizing (the Quran, an-Nawawi's forty hadith, …).
 * To add one: give it items, create `app/zad/memorization/<slug>/page.tsx`, and add a card to `app/zad/page.tsx`
 * (the generic `ItemGrid` works for any collection; the Quran additionally has the heart view).
 */
export interface Collection {
  slug: string;
  title: string;
  description: string;
  /** How to count items, e.g. "سورة واحدة / سورتين / 5 سور / 12 سورة" */
  itemForms: CountForms;
  /** Singular label shown before an item name, e.g. "سورة الكهف" */
  itemLabel: string;
  items: MemorizationItem[];
}

export const QURAN: Collection = {
  slug: "quran",
  title: "القرآن الكريم",
  description: "حدّد السور التي حفظتها على قلب مصمم من سور القرآن الكريم، وتابع تقدمك سورةً سورة.",
  itemForms: { one: "سورة واحدة", two: "سورتين", few: "سور", many: "سورة" },
  itemLabel: "سورة",
  items: SURAHS,
};

export const collectionHref = (slug: string) => `/zad/memorization/${slug}/`;
