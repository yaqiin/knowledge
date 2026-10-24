import booksJson from "@/data/books.json";
import holyPlacesJson from "@/data/holy-places.json";
import toolsJson from "@/data/tools.json";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  pages: number | null;
  cover: string;
  downloadLink: string | null;
  categories: string[];
}

export interface HolyPlace {
  slug: string;
  name: string;
  location: string;
  mapsLink: string;
  /** Markdown */
  description: string;
  /** First image is the cover */
  images: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  link: string;
  category: string | null;
}

export const books: Book[] = booksJson;
export const holyPlaces: HolyPlace[] = holyPlacesJson;
export const tools: Tool[] = toolsJson;

export function getHolyPlace(slug: string): HolyPlace | undefined {
  return holyPlaces.find(place => place.slug === slug);
}

/** Distinct, non-empty values in first-seen order. */
export function uniqueValues(values: (string | null)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))];
}

/**
 * Arabic count phrase following number–noun agreement:
 * 1 → "كتاب واحد", 2 → "كتابان", 3–10 → "5 كتب", 11+ → "12 كتاباً".
 */
export function arabicCount(n: number, forms: { one: string; two: string; few: string; many: string }): string {
  if (n === 1) return forms.one;
  if (n === 2) return forms.two;
  const mod100 = n % 100;
  return `${n} ${mod100 >= 3 && mod100 <= 10 ? forms.few : forms.many}`;
}

/** First paragraph of a Markdown text, stripped of Markdown syntax, for previews and meta descriptions. */
export function excerpt(markdown: string, maxLength = 160): string {
  const firstParagraph = markdown
    .split(/\n\s*\n/)
    .map(p => p.replace(/[#*_>`[\]]/g, "").replace(/\(https?:[^)]*\)/g, "").trim())
    .find(Boolean) ?? "";
  return firstParagraph.length > maxLength ? `${firstParagraph.slice(0, maxLength).trimEnd()}…` : firstParagraph;
}
