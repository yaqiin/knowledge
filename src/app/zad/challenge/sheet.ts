import { DISPLAY, escapeXml, getTheme, SANS, type Sheet } from "../habits/sheet";

/**
 * The printable 90-day challenge as SVG markup (A4 portrait in CSS pixels):
 * goals and a "why" box on top, then 90 squares to tick off one day at a time.
 */

export const DAYS = 90;
export const MAX_GOALS = 6;
export const MAX_GOAL_LENGTH = 40;
export const DEFAULT_TITLE = "تحدي 90 يوماً";

export interface ChallengeOptions {
  title: string;
  /** Up to MAX_GOALS; empty entries print as blank lines to fill by hand */
  goals: string[];
  /** Id from THEMES */
  theme: string;
}

const COLUMNS = 9;
/** Days that close a month get a stronger outline */
const MILESTONE = 30;

export function buildChallengeSheet({ title, goals, theme }: ChallengeOptions, fontCss = ""): Sheet {
  const C = getTheme(theme);
  const width = 794;
  const height = 1123;
  const margin = 48;
  const right = width - margin;
  const contentWidth = width - margin * 2;

  const parts: string[] = [];
  const text = (x: number, y: number, content: string, attrs: string) =>
    parts.push(`<text x="${x}" y="${y}" ${attrs}>${escapeXml(content)}</text>`);
  const rtl = (size: number, fill: string, weight = 400) =>
    `direction="rtl" text-anchor="start" font-family="${SANS}" font-size="${size}" font-weight="${weight}" fill="${fill}"`;
  /** A heading on a soft pill, like a label on a notebook page */
  const pill = (xRight: number, y: number, label: string, pillWidth: number) => {
    parts.push(`<rect x="${xRight - pillWidth}" y="${y}" width="${pillWidth}" height="30" rx="15" fill="${C.stripe}"/>`);
    text(xRight - 16, y + 20, label, rtl(16, C.header, 700));
  };

  // Header
  text(width / 2, margin + 40, title.trim() || " ", `text-anchor="middle" font-family="${DISPLAY}" font-size="36" font-weight="700" fill="${C.ink}"`);
  // Thmanyah Sans draws the Quranic brackets ﴿﴾ as small chevrons; the serif face (also embedded) has clear ones.
  // Pinned to LTR (the standalone export default) so the RTL page does not swap the brackets in the preview
  const bracket = (c: string) => `<tspan font-family="${DISPLAY}" font-weight="700" font-size="17">${c}</tspan>`;
  parts.push(`<text x="${width / 2}" y="${margin + 74}" direction="ltr" text-anchor="middle" font-family="${SANS}" font-size="15" fill="${C.accent}">`
    + `${bracket("\uFD3E")} وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ${bracket("\uFD3F")}</text>`);

  // Goals (right column) and "why" box (left column)
  const top = margin + 108;
  const gap = 28;
  const colWidth = (contentWidth - gap) / 2;
  const goalsRight = right;
  const goalsLeft = right - colWidth;
  pill(goalsRight, top, "أهدافي", 110);
  text(goalsRight - 4, top + 56, "ماذا أريد أن أحقق في هذه الأيام؟", rtl(13, C.faint));
  const goalRow = 40;
  const goalsTop = top + 72;
  for (let i = 0; i < MAX_GOALS; i++) {
    const y = goalsTop + (i + 1) * goalRow;
    // Target marker
    const cx = goalsRight - 12;
    const cy = y - 10;
    parts.push(`<circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="${C.muted}" stroke-width="1.5"/>`
      + `<circle cx="${cx}" cy="${cy}" r="5.5" fill="none" stroke="${C.muted}" stroke-width="1.5"/>`
      + `<circle cx="${cx}" cy="${cy}" r="2" fill="${C.muted}"/>`);
    parts.push(`<line x1="${goalsLeft}" y1="${y}" x2="${goalsRight - 32}" y2="${y}" stroke="${C.circle}" stroke-width="1.2"/>`);
    const goal = goals[i]?.trim();
    if (goal) text(goalsRight - 34, y - 8, goal, rtl(16, C.ink));
  }
  const topEnd = goalsTop + MAX_GOALS * goalRow;

  const whyRight = margin + colWidth;
  const whyTop = top + 15;
  parts.push(`<rect x="${margin}" y="${whyTop}" width="${colWidth}" height="${topEnd - whyTop + 8}" rx="16" fill="none" stroke="${C.circle}" stroke-width="1.5"/>`);
  // The heading sits on the box border
  parts.push(`<rect x="${whyRight - 176}" y="${top}" width="160" height="30" rx="15" fill="${C.stripe}"/>`);
  text(whyRight - 32, top + 20, "لماذا أفعل هذا؟", rtl(16, C.header, 700));
  text(whyRight - 20, top + 56, "نيتي والغاية التي أرجوها", rtl(13, C.faint));
  for (let y = goalsTop + goalRow; y <= topEnd; y += goalRow) {
    parts.push(`<line x1="${margin + 20}" y1="${y}" x2="${whyRight - 20}" y2="${y}" stroke="${C.line}" stroke-width="1.2"/>`);
  }

  // The 90 days
  const daysTop = topEnd + 56;
  text(width / 2, daysTop + 30, `${DAYS} يوماً`, `text-anchor="middle" font-family="${DISPLAY}" font-size="30" font-weight="700" fill="${C.ink}"`);
  text(right, daysTop + 30, "تاريخ البدء:", rtl(13, C.faint));
  parts.push(`<line x1="${right - 180}" y1="${daysTop + 32}" x2="${right - 76}" y2="${daysTop + 32}" stroke="${C.circle}"/>`);

  const gridTop = daysTop + 56;
  const footerHeight = 40;
  const gridBottom = height - margin - footerHeight;
  const rows = Math.ceil(DAYS / COLUMNS);
  const cellWidth = contentWidth / COLUMNS;
  const cellHeight = (gridBottom - gridTop) / rows;
  const size = Math.min(cellWidth, cellHeight) * 0.78;
  for (let i = 0; i < DAYS; i++) {
    const day = i + 1;
    // Day 1 sits top-right (RTL)
    const cx = right - (i % COLUMNS + 0.5) * cellWidth;
    const cy = gridTop + (Math.floor(i / COLUMNS) + 0.5) * cellHeight;
    const milestone = day % MILESTONE === 0;
    parts.push(`<rect x="${cx - size / 2}" y="${cy - size / 2}" width="${size}" height="${size}" rx="9" fill="none" `
      + `stroke="${milestone ? C.muted : C.circle}" stroke-width="${milestone ? 2.2 : 1.5}"/>`);
    text(cx, cy + 5, String(day), `text-anchor="middle" font-family="${SANS}" font-size="13" font-weight="${milestone ? 700 : 400}" fill="${milestone ? C.muted : C.faint}" fill-opacity="${milestone ? 1 : 0.55}"`);
  }

  // Footer
  text(right, height - margin + 4, "يقين للمعرفة · knowledge.yaqiin.org", rtl(12, C.faint));

  const style = fontCss ? `<style>${fontCss}</style>` : "";
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`
    + style + `<rect width="${width}" height="${height}" fill="#ffffff"/>` + parts.join("") + `</svg>`;
  return { markup, width, height, landscape: false };
}
