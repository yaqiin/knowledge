import heartJson from "@/data/quran-heart.json";
import { SURAHS } from "./surahs";

export interface SurahShape {
  /** Surah number, as in SURAHS */
  id: string;
  /** SVG path data; usually one path, two for الشعراء */
  paths: string[];
  /** Label position */
  x: number;
  y: number;
}

export const HEART: { viewBox: string; shapes: SurahShape[] } = heartJson;

export const SURAH_NAMES = new Map(SURAHS.map(s => [s.id, s.name]));

export type HeartPalette = {
  surah: string;
  surahDone: string;
  label: string;
  labelDone: string;
  border?: string;
};

/** Colours of the heart inside the site (light theme). */
export const SITE_COLORS: HeartPalette = {
  surah: "#ecfdf5",
  surahDone: "#059669",
  label: "#064e3b",
  labelDone: "#ffffff",
  /** Outline of each surah, so the shapes stand out on the light background */
  border: "#34d399",
};

/** Preset colours for memorized surahs in the downloaded image (any colour can also be picked). */
export const HIGHLIGHTS = [
  { label: "ذهبي", color: "#fbbf24" },
  { label: "أحمر", color: "#e63946" },
  { label: "أخضر", color: "#10b981" },
  { label: "أزرق", color: "#38bdf8" },
  { label: "بنفسجي", color: "#a78bfa" },
  { label: "وردي", color: "#f472b6" },
  { label: "برتقالي", color: "#fb923c" },
];

export const DEFAULT_HIGHLIGHT = HIGHLIGHTS[0].color;

const DARK_TEXT = "#022c22";

/** Dark or white text, whichever reads better on `hex` (YIQ brightness). */
function textOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 >= 150 ? DARK_TEXT : "#ffffff";
}

/** Colours of the downloaded image: white surahs on a dark background, memorized ones in `highlight`. */
export function exportPalette(highlight: string): HeartPalette {
  return { surah: "#ffffff", surahDone: highlight, label: DARK_TEXT, labelDone: textOn(highlight) };
}

export const isHexColor = (value: string | null): value is string => Boolean(value && /^#[0-9a-f]{6}$/i.test(value));

export interface Background {
  id: string;
  label: string;
  /** One stop = solid colour; several = 135° gradient */
  stops: string[];
}

export const BACKGROUNDS: Background[] = [
  { id: "emerald", label: "زمردي", stops: ["#022c22", "#065f46", "#022c22"] },
  { id: "night", label: "ليلي", stops: ["#1a1f2e", "#2d1b3d", "#1a1f2e"] },
  { id: "ocean", label: "محيطي", stops: ["#0f2027", "#203a43", "#2c5364"] },
  { id: "royal", label: "ملكي", stops: ["#1e3c72", "#2a5298", "#1e3c72"] },
  { id: "violet", label: "بنفسجي", stops: ["#2d1b3d", "#8b5a9f", "#2d1b3d"] },
  { id: "navy", label: "كحلي", stops: ["#1a1a2e", "#16213e", "#0f3460"] },
  { id: "earth", label: "ترابي", stops: ["#2c1810", "#8b4513", "#2c1810"] },
  { id: "slate", label: "رمادي", stops: ["#222831"] },
];

export function backgroundCss({ stops }: Background): string {
  if (stops.length === 1) return stops[0];
  const parts = stops.map((color, i) => `${color} ${(i / (stops.length - 1)) * 100}%`);
  return `linear-gradient(135deg, ${parts.join(", ")})`;
}
