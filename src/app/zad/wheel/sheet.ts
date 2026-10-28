import { DISPLAY, escapeXml, getTheme, SANS, type Sheet } from "../habits/sheet";

/**
 * The printable wheel of life as SVG markup (A4 portrait in CSS pixels): one slice per area of life,
 * filled up to its score, then the three weakest areas with room to write the next step.
 */

/** Order matters: area 1 starts at the top and the wheel goes clockwise. Ids are stored in the visitor's browser. */
export const AREAS = [
  { id: "allah", label: "العلاقة مع الله" },
  { id: "quran", label: "القرآن" },
  { id: "knowledge", label: "العلم" },
  { id: "family", label: "الأسرة" },
  { id: "community", label: "الرحم والمجتمع" },
  { id: "health", label: "الصحة" },
  { id: "work", label: "العمل والكسب" },
  { id: "money", label: "المال والصدقة" },
  { id: "character", label: "الأخلاق" },
  { id: "self", label: "النفس والراحة" },
] as const;

export type AreaId = (typeof AREAS)[number]["id"];
export type Scores = Record<AreaId, number>;

export const MAX_SCORE = 10;
export const DEFAULT_SCORE = 5;
export const DEFAULT_TITLE = "عجلة حياتي";
export const MAX_PRIORITIES = 3;

export interface WheelOptions {
  title: string;
  scores: Scores;
  /** Print an empty wheel to colour in by hand */
  blank: boolean;
  /** Areas the visitor chose to work on, in order; empty means "the weakest ones" */
  priorities: AreaId[];
  /** Id from THEMES */
  theme: string;
}

export const defaultScores = () => Object.fromEntries(AREAS.map(a => [a.id, DEFAULT_SCORE])) as Scores;

export function buildWheelSheet({ title, scores, blank, priorities, theme }: WheelOptions, fontCss = ""): Sheet {
  const C = getTheme(theme);
  const width = 794;
  const height = 1123;
  const margin = 48;
  const right = width - margin;

  const parts: string[] = [];
  const text = (x: number, y: number, content: string, attrs: string) =>
    parts.push(`<text x="${x}" y="${y}" ${attrs}>${escapeXml(content)}</text>`);
  const rtl = (size: number, fill: string, weight = 400) =>
    `direction="rtl" text-anchor="start" font-family="${SANS}" font-size="${size}" font-weight="${weight}" fill="${fill}"`;

  // Header
  text(width / 2, margin + 40, title.trim() || " ", `text-anchor="middle" font-family="${DISPLAY}" font-size="36" font-weight="700" fill="${C.ink}"`);
  // Thmanyah Sans draws the Quranic brackets ﴿﴾ as small chevrons; the serif face (also embedded) has clear ones.
  // Pinned to LTR (the standalone export default) so the RTL page does not swap the brackets in the preview
  const bracket = (c: string) => `<tspan font-family="${DISPLAY}" font-weight="700" font-size="17">${c}</tspan>`;
  parts.push(`<text x="${width / 2}" y="${margin + 74}" direction="ltr" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${C.accent}">`
    + `${bracket("\uFD3E")} إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ ${bracket("\uFD3F")}</text>`);
  text(right, margin + 112, "التاريخ:", rtl(13, C.faint));
  parts.push(`<line x1="${right - 160}" y1="${margin + 114}" x2="${right - 56}" y2="${margin + 114}" stroke="${C.circle}"/>`);

  // The wheel: area 1 at the top, clockwise
  const cx = width / 2;
  const cy = 470;
  const radius = 200;
  const slice = (2 * Math.PI) / AREAS.length;
  const angle = (i: number) => -Math.PI / 2 + i * slice;
  const xy = (r: number, a: number) => [(cx + r * Math.cos(a)).toFixed(2), (cy + r * Math.sin(a)).toFixed(2)];
  const point = (r: number, a: number) => xy(r, a).join(",");
  const wedge = (r: number, i: number) =>
    `M${cx},${cy} L${point(r, angle(i))} A${r},${r} 0 0 1 ${point(r, angle(i + 1))} Z`;

  if (!blank) {
    AREAS.forEach((area, i) => {
      const r = (radius * scores[area.id]) / MAX_SCORE;
      // Alternate the shade so neighbouring slices stay distinct, even in grey
      parts.push(`<path d="${wedge(r, i)}" fill="${C.muted}" fill-opacity="${i % 2 ? 0.55 : 0.8}"/>`);
    });
  }
  for (let ring = 1; ring <= MAX_SCORE; ring++) {
    const outer = ring === MAX_SCORE;
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${(radius * ring) / MAX_SCORE}" fill="none" `
      + `stroke="${outer ? C.muted : C.line}" stroke-width="${outer ? 2 : 1}"/>`);
  }
  AREAS.forEach((_, i) => {
    const [x, y] = xy(radius, angle(i));
    parts.push(`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${C.circle}" stroke-width="1.2"/>`);
  });
  // Ring numbers along the first spoke, to guide colouring by hand
  for (let ring = 2; ring <= MAX_SCORE; ring += 2) {
    text(cx + 4, cy - (radius * ring) / MAX_SCORE + 12, String(ring), `direction="rtl" text-anchor="end" font-family="${SANS}" font-size="10" fill="${C.faint}"`);
  }

  // Labels outside the wheel, anchored away from it. Every text sets direction="rtl" so the on-screen preview
  // (inside an RTL page) and the exported image (standalone SVG) anchor it the same way; in RTL, "end" is the left edge.
  // Scores are written "8/10" without spaces: one number run, which no text direction can reorder
  AREAS.forEach((area, i) => {
    const mid = angle(i + 0.5);
    const cos = Math.cos(mid);
    const sin = Math.sin(mid);
    // Rounded like the wedge points: trig results can differ in the last digits between the server and the browser
    const x = Math.round(cx + (radius + 20) * cos);
    const y = Math.round(cy + (radius + 20) * sin + (sin > 0.3 ? 14 : sin < -0.3 ? -10 : 4));
    const anchor = cos > 0.2 ? "end" : cos < -0.2 ? "start" : "middle";
    text(x, y, area.label, `direction="rtl" text-anchor="${anchor}" font-family="${SANS}" font-size="15" font-weight="700" fill="${C.ink}"`);
    if (!blank) {
      text(x, y + 18, `${scores[area.id]}/${MAX_SCORE}`, `direction="rtl" text-anchor="${anchor}" font-family="${SANS}" font-size="13" font-weight="700" fill="${C.accent}"`);
    }
  });

  // Priorities: the visitor's choice, else the weakest areas. Missing ones print as blank lines to fill by hand
  const top = 770;
  const chosen = priorities.length > 0;
  const listed: string[] = chosen
    ? priorities.map(id => AREAS.find(a => a.id === id)!.label)
    : blank ? [] : [...AREAS].sort((a, b) => scores[a.id] - scores[b.id]).slice(0, MAX_PRIORITIES).map(a => a.label);
  parts.push(`<rect x="${right - 210}" y="${top}" width="210" height="30" rx="15" fill="${C.stripe}"/>`);
  text(right - 16, top + 20, "أولوياتي للمرحلة القادمة", rtl(16, C.header, 700));
  const hint = chosen ? "الجوانب التي اخترت العمل عليها" : blank ? "اختر الجوانب الأضعف في عجلتك" : "أضعف الجوانب في عجلتك";
  text(margin + 300, top + 20, hint, `text-anchor="middle" font-family="${SANS}" font-size="13" fill="${C.faint}"`);
  const rowHeight = 76;
  for (let i = 0; i < MAX_PRIORITIES; i++) {
    const y = top + 68 + i * rowHeight;
    parts.push(`<circle cx="${right - 12}" cy="${y - 6}" r="12" fill="${C.header}"/>`);
    text(right - 12, y - 1, String(i + 1), `text-anchor="middle" font-family="${SANS}" font-size="13" font-weight="700" fill="#ffffff"`);
    if (listed[i]) {
      text(right - 34, y, listed[i], rtl(16, C.ink, 700));
    } else {
      parts.push(`<line x1="${right - 200}" y1="${y + 2}" x2="${right - 34}" y2="${y + 2}" stroke="${C.circle}"/>`);
    }
    text(right - 220, y, "خطوتي القادمة:", rtl(13, C.faint));
    parts.push(`<line x1="${margin}" y1="${y + 2}" x2="${right - 316}" y2="${y + 2}" stroke="${C.circle}"/>`);
    parts.push(`<line x1="${margin}" y1="${y + 36}" x2="${right - 34}" y2="${y + 36}" stroke="${C.line}"/>`);
  }

  // Footer
  text(right, height - margin + 4, "يقين للمعرفة · knowledge.yaqiin.org", rtl(12, C.faint));

  const style = fontCss ? `<style>${fontCss}</style>` : "";
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`
    + style + `<rect width="${width}" height="${height}" fill="#ffffff"/>` + parts.join("") + `</svg>`;
  return { markup, width, height, landscape: false };
}
