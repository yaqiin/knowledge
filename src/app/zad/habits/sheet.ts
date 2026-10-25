/**
 * The printable habit sheet as SVG markup: one source for the on-screen preview, the image, and the PDF.
 * Sized like an A4 page in CSS pixels: landscape for a month (30 day columns), portrait for a week.
 */

export interface SheetOptions {
  title: string;
  habits: string[];
  days: number;
  /** Id from THEMES */
  theme: string;
}

export interface Sheet {
  markup: string;
  width: number;
  height: number;
  landscape: boolean;
}

interface Theme {
  id: string;
  label: string;
  ink: string;
  muted: string;
  faint: string;
  header: string;
  stripe: string;
  line: string;
  circle: string;
  /** The verse under the title */
  accent: string;
}

/** Complete palettes, so any choice prints harmoniously. The last one saves ink / suits black-and-white printers. */
export const THEMES: Theme[] = [
  { id: "emerald", label: "أخضر", ink: "#022c22", muted: "#047857", faint: "#6b8f84", header: "#065f46", stripe: "#ecfdf5", line: "#d1fae5", circle: "#6ee7b7", accent: "#d97706" },
  { id: "blue", label: "أزرق", ink: "#082f49", muted: "#0369a1", faint: "#64748b", header: "#075985", stripe: "#f0f9ff", line: "#e0f2fe", circle: "#7dd3fc", accent: "#d97706" },
  { id: "violet", label: "بنفسجي", ink: "#2e1065", muted: "#6d28d9", faint: "#7c7391", header: "#5b21b6", stripe: "#f5f3ff", line: "#ede9fe", circle: "#c4b5fd", accent: "#d97706" },
  { id: "rose", label: "وردي", ink: "#4c0519", muted: "#be123c", faint: "#8f6b72", header: "#9f1239", stripe: "#fff1f2", line: "#ffe4e6", circle: "#fda4af", accent: "#b45309" },
  { id: "amber", label: "بني", ink: "#451a03", muted: "#b45309", faint: "#8a7560", header: "#92400e", stripe: "#fffbeb", line: "#fef3c7", circle: "#fcd34d", accent: "#047857" },
  { id: "slate", label: "رمادي (لتوفير الحبر)", ink: "#0f172a", muted: "#475569", faint: "#64748b", header: "#334155", stripe: "#f8fafc", line: "#e2e8f0", circle: "#94a3b8", accent: "#475569" },
];

export const DEFAULT_THEME = THEMES[0].id;

const SANS = "'Thmanyah Sans', Tahoma, Arial, sans-serif";
const DISPLAY = "'Thmanyah Serif Display', 'Thmanyah Sans', Tahoma, serif";

const escapeXml = (s: string) => s.replace(/[<>&"']/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Builds the sheet. `fontCss` (embedded @font-face rules) is only needed when rendering to an image. */
export function buildSheet({ title, habits, days, theme }: SheetOptions, fontCss = ""): Sheet {
  const C = THEMES.find(t => t.id === theme) ?? THEMES[0];
  const landscape = days > 7;
  const width = landscape ? 1123 : 794;
  const height = landscape ? 794 : 1123;
  const margin = 48;

  const gridTop = margin + 104;
  const footerHeight = 40;
  const gridBottom = height - margin - footerHeight;
  const nameWidth = landscape ? 230 : 260;
  const headerHeight = 38;
  const dayWidth = (width - margin * 2 - nameWidth) / days;
  const rows = Math.max(habits.length, 1);
  const rowHeight = Math.min(landscape ? 52 : 64, (gridBottom - gridTop - headerHeight) / rows);
  const gridHeight = headerHeight + rowHeight * habits.length;
  const right = width - margin;
  const namesLeft = right - nameWidth;

  const parts: string[] = [];
  const text = (x: number, y: number, content: string, attrs: string) =>
    parts.push(`<text x="${x}" y="${y}" ${attrs}>${escapeXml(content)}</text>`);

  // Header
  text(width / 2, margin + 40, title.trim() || " ", `text-anchor="middle" font-family="${DISPLAY}" font-size="36" font-weight="700" fill="${C.ink}"`);
  // Thmanyah Sans draws the Quranic brackets ﴿﴾ as small chevrons; the serif face (also embedded) has clear ones
  const bracket = (c: string) => `<tspan font-family="${DISPLAY}" font-weight="700" font-size="17">${c}</tspan>`;
  parts.push(`<text x="${width / 2}" y="${margin + 74}" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${C.accent}">`
    + `${bracket("﴾")} وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَى ${bracket("﴿")}</text>`);

  // Column header row
  parts.push(`<rect x="${margin}" y="${gridTop}" width="${width - margin * 2}" height="${headerHeight}" rx="10" fill="${C.header}"/>`);
  text(right - 16, gridTop + headerHeight / 2 + 6, "العادة", `direction="rtl" text-anchor="start" font-family="${SANS}" font-size="16" font-weight="700" fill="#ffffff"`);
  for (let d = 1; d <= days; d++) {
    const cx = namesLeft - (d - 0.5) * dayWidth; // day 1 sits next to the names (RTL)
    text(cx, gridTop + headerHeight / 2 + 5, String(d), `text-anchor="middle" font-family="${SANS}" font-size="${landscape ? 13 : 16}" font-weight="700" fill="#ffffff"`);
  }

  // Habit rows
  const radius = Math.min(dayWidth, rowHeight) * 0.3;
  habits.forEach((habit, i) => {
    const y = gridTop + headerHeight + i * rowHeight;
    if (i % 2 === 1) parts.push(`<rect x="${margin}" y="${y}" width="${width - margin * 2}" height="${rowHeight}" fill="${C.stripe}"/>`);
    text(right - 16, y + rowHeight / 2 + 6, habit, `direction="rtl" text-anchor="start" font-family="${SANS}" font-size="${landscape ? 16 : 18}" fill="${C.ink}"`);
    for (let d = 1; d <= days; d++) {
      const cx = namesLeft - (d - 0.5) * dayWidth;
      parts.push(`<circle cx="${cx}" cy="${y + rowHeight / 2}" r="${radius}" fill="none" stroke="${C.circle}" stroke-width="1.5"/>`);
    }
  });

  // Grid lines: below each row, and between days
  const gridEnd = gridTop + gridHeight;
  for (let i = 1; i <= habits.length; i++) {
    const y = gridTop + headerHeight + i * rowHeight;
    parts.push(`<line x1="${margin}" y1="${y}" x2="${right}" y2="${y}" stroke="${C.line}"/>`);
  }
  for (let d = 0; d < days; d++) {
    const x = namesLeft - d * dayWidth;
    parts.push(`<line x1="${x}" y1="${gridTop + headerHeight}" x2="${x}" y2="${gridEnd}" stroke="${C.line}"/>`);
  }

  // Notes box in the remaining space
  const notesTop = gridEnd + 24;
  if (gridBottom - notesTop > 90) {
    parts.push(`<rect x="${margin}" y="${notesTop}" width="${width - margin * 2}" height="${gridBottom - notesTop}" rx="14" fill="none" stroke="${C.line}" stroke-width="1.5"/>`);
    text(right - 16, notesTop + 28, "ملاحظات", `direction="rtl" text-anchor="start" font-family="${SANS}" font-size="15" font-weight="700" fill="${C.muted}"`);
  }

  // Footer
  const footerY = height - margin + 4;
  text(right, footerY, "يقين للمعرفة · knowledge.yaqiin.org", `direction="rtl" text-anchor="start" font-family="${SANS}" font-size="12" fill="${C.faint}"`);

  const style = fontCss ? `<style>${fontCss}</style>` : "";
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`
    + style + `<rect width="${width}" height="${height}" fill="#ffffff"/>` + parts.join("") + `</svg>`;
  return { markup, width, height, landscape };
}
