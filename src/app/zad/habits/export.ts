import { jpegToPdf, saveBlob } from "@/lib/download";
import type { Sheet } from "./sheet";

/** Draws a sheet; receives the embedded @font-face rules it needs to render as an image. */
export type SheetBuilder = (fontCss: string) => Sheet;

// An SVG drawn into a canvas can't use the page's web fonts, so the sheet embeds them as data URLs
const FONTS = [
  { family: "Thmanyah Sans", weight: 400, file: "thmanyahsans-Regular.woff2" },
  { family: "Thmanyah Sans", weight: 700, file: "thmanyahsans-Bold.woff2" },
  { family: "Thmanyah Serif Display", weight: 700, file: "thmanyahserifdisplay-Bold.woff2" },
];

let fontCssPromise: Promise<string> | null = null;

function embeddedFontCss(): Promise<string> {
  fontCssPromise ??= Promise.all(FONTS.map(async ({ family, weight, file }) => {
    const buffer = await (await fetch(`/fonts/${file}`)).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${btoa(binary)}) format('woff2');}`;
  })).then(rules => rules.join(""));
  fontCssPromise.catch(() => { fontCssPromise = null; });
  return fontCssPromise;
}

/** Renders the sheet onto a canvas `scale` times its CSS size. */
async function renderSheet(build: SheetBuilder, scale: number) {
  const sheet = build(await embeddedFontCss());
  const url = URL.createObjectURL(new Blob([sheet.markup], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sheet.width * scale);
    canvas.height = Math.round(sheet.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { canvas, sheet };
  } finally {
    URL.revokeObjectURL(url);
  }
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error("canvas export failed"))), type, quality));

const fileName = (name: string, ext: string) =>
  `${name.replace(/[\\/:*?"<>|\s]+/g, "-")}.${ext}`;

export async function downloadImage(build: SheetBuilder, name: string) {
  const { canvas } = await renderSheet(build, 2);
  saveBlob(await toBlob(canvas, "image/png"), fileName(name, "png"));
}

const A4 = { short: 595.28, long: 841.89 };

export async function downloadPdf(build: SheetBuilder, name: string) {
  // ~290 dpi on A4: sharp when printed
  const { canvas, sheet } = await renderSheet(build, 3);
  const jpeg = new Uint8Array(await (await toBlob(canvas, "image/jpeg", 0.92)).arrayBuffer());
  const [pageWidth, pageHeight] = sheet.landscape ? [A4.long, A4.short] : [A4.short, A4.long];
  saveBlob(jpegToPdf(jpeg, canvas.width, canvas.height, pageWidth, pageHeight), fileName(name, "pdf"));
}
