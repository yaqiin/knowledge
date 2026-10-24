import { HEART, SURAH_NAMES, exportPalette, type Background, type HeartPalette } from "./heart";

export type FileType = "png" | "jpg" | "svg";

const PADDING = 5;

const escapeXml = (s: string) => s.replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);

/** Standalone SVG markup of the heart with memorized surahs highlighted (no background). */
function heartMarkup(memorized: Set<string>, palette: HeartPalette, extraAttributes = "", prefix = ""): string {
  const groups = HEART.shapes.map(({ id, paths, x, y }) => {
    const done = memorized.has(id);
    const pathEls = paths.map(d => `<path d="${d}" fill="${done ? palette.surahDone : palette.surah}"/>`).join("");
    const label = escapeXml(SURAH_NAMES.get(id) ?? "");
    return `<g>${pathEls}<text x="${x}" y="${y}" fill="${done ? palette.labelDone : palette.label}">${label}</text></g>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${HEART.viewBox}" preserveAspectRatio="xMidYMid meet" ${extraAttributes}>`
    + `<style>text{font-family:'Thmanyah Sans',Tahoma,Arial,sans-serif;font-size:9px;font-weight:bold}</style>`
    + prefix + groups.join("") + `</svg>`;
}

/** Fits the heart inside a w×h canvas, keeping its aspect ratio. */
function fit(w: number, h: number) {
  const [, , vw, vh] = HEART.viewBox.split(/\s+/).map(Number);
  const ratio = vw / vh;
  const availableW = w - PADDING * 2;
  const availableH = h - PADDING * 2;
  const width = ratio > availableW / availableH ? availableW : availableH * ratio;
  const height = width / ratio;
  return { width, height, x: (w - width) / 2, y: (h - height) / 2 };
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Give the browser time to start the download before releasing the blob
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const filename = (w: number, h: number, ext: string) => `محفوظاتي-القرآن-${w}x${h}.${ext}`;

function downloadSvg(w: number, h: number, memorized: Set<string>, background: Background, palette: HeartPalette) {
  const [vx, vy, vw, vh] = HEART.viewBox.split(/\s+/).map(Number);
  // Background covers the whole image, not just the heart's viewBox ("meet" scales by the smaller ratio)
  const scale = Math.min(w / vw, h / vh);
  const bw = w / scale;
  const bh = h / scale;
  const bx = vx - (bw - vw) / 2;
  const by = vy - (bh - vh) / 2;
  const gradient = background.stops.length > 1
    ? `<defs><linearGradient id="bg" gradientUnits="userSpaceOnUse" x1="${bx}" y1="${by}" x2="${bx + bw}" y2="${by + bh}">`
      + background.stops.map((c, i) => `<stop offset="${(i / (background.stops.length - 1)) * 100}%" stop-color="${c}"/>`).join("")
      + `</linearGradient></defs>`
    : "";
  const fill = background.stops.length > 1 ? "url(#bg)" : background.stops[0];
  const rect = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${fill}"/>`;
  const markup = heartMarkup(memorized, palette, `width="${w}" height="${h}"`, gradient + rect);
  save(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }), filename(w, h, "svg"));
}

function downloadRaster(w: number, h: number, type: "jpg" | "png", memorized: Set<string>, background: Background, palette: HeartPalette) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (background.stops.length > 1) {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    background.stops.forEach((c, i) => gradient.addColorStop(i / (background.stops.length - 1), c));
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = background.stops[0];
  }
  ctx.fillRect(0, 0, w, h);

  const svgUrl = URL.createObjectURL(new Blob([heartMarkup(memorized, palette)], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  img.onload = () => {
    const { width, height, x, y } = fit(w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, x, y, width, height);
    URL.revokeObjectURL(svgUrl);
    canvas.toBlob(
      blob => blob && save(blob, filename(w, h, type)),
      type === "jpg" ? "image/jpeg" : "image/png",
      type === "jpg" ? 0.92 : 1,
    );
  };
  img.src = svgUrl;
}

export function downloadHeart(
  w: number, h: number, type: FileType, memorized: Set<string>, background: Background, highlight: string,
) {
  const palette = exportPalette(highlight);
  if (type === "svg") downloadSvg(w, h, memorized, background, palette);
  else downloadRaster(w, h, type, memorized, background, palette);
}
