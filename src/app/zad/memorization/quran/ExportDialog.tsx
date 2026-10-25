"use client";

import { Download, Pipette, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/data";
import { useDismiss } from "@/lib/useDismiss";
import { readStorage, writeStorage } from "../../storage";
import { downloadHeart, type FileType } from "./download";
import {
  BACKGROUNDS, DEFAULT_HIGHLIGHT, HIGHLIGHTS, backgroundCss, exportPalette, isHexColor, type Background,
} from "./heart";
import { QuranHeart } from "./QuranHeart";

const SIZES = [
  { id: "desktop", label: "خلفية كمبيوتر", w: 1920, h: 1080 },
  { id: "phone", label: "خلفية هاتف", w: 1080, h: 1920 },
  { id: "square", label: "منشور مربع", w: 1080, h: 1080 },
  { id: "custom", label: "حجم مخصص", w: 0, h: 0 },
] as const;

type SizeId = (typeof SIZES)[number]["id"];

const MIN_SIZE = 100;
const MAX_SIZE = 10000;
const BACKGROUND_KEY = "memorization:export-background";
const HIGHLIGHT_KEY = "memorization:export-highlight";

export function ExportDialog({ memorized, onClose }: { memorized: Set<string>; onClose: () => void }) {
  const [background, setBackground] = useState<Background>(BACKGROUNDS[0]);
  const [highlight, setHighlight] = useState(DEFAULT_HIGHLIGHT);
  const [sizeId, setSizeId] = useState<SizeId>("phone");
  const [custom, setCustom] = useState({ w: "2560", h: "1440" });
  const [type, setType] = useState<FileType>("png");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDismiss(dialogRef, true, onClose);

  useEffect(() => {
    const saved = BACKGROUNDS.find(bg => bg.id === readStorage(BACKGROUND_KEY));
    if (saved) setBackground(saved);
    const savedHighlight = readStorage(HIGHLIGHT_KEY);
    if (isHexColor(savedHighlight)) setHighlight(savedHighlight);
    closeRef.current?.focus();
    // Keep the page behind from scrolling while the dialog is open
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const preset = SIZES.find(s => s.id === sizeId)!;
  const width = sizeId === "custom" ? Number(custom.w) : preset.w;
  const height = sizeId === "custom" ? Number(custom.h) : preset.h;
  const validSize = Number.isInteger(width) && Number.isInteger(height)
    && width >= MIN_SIZE && width <= MAX_SIZE && height >= MIN_SIZE && height <= MAX_SIZE;

  const chooseBackground = (bg: Background) => {
    setBackground(bg);
    writeStorage(BACKGROUND_KEY, bg.id);
  };

  const chooseHighlight = (color: string) => {
    setHighlight(color);
    writeStorage(HIGHLIGHT_KEY, color);
  };

  const isCustomHighlight = !HIGHLIGHTS.some(h => h.color.toLowerCase() === highlight.toLowerCase());

  const submit = () => {
    if (!validSize) {
      setError(`الأبعاد يجب أن تكون أعداداً صحيحة بين ${MIN_SIZE} و ${formatNumber(MAX_SIZE)} بكسل`);
      return;
    }
    downloadHeart(width, height, type, memorized, background, highlight);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-emerald-950/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-emerald-900/5 px-6 py-4">
          <h2 id="export-title" className="font-display text-xl font-bold text-emerald-950">تحميل صورة محفوظاتي</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="إغلاق"
            className="flex h-9 w-9 items-center justify-center rounded-full text-emerald-900/60 transition hover:bg-emerald-50 hover:text-emerald-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[1fr_1.1fr]">
          {/* Live preview in the chosen proportions */}
          <div className="flex items-center justify-center rounded-2xl bg-emerald-50/60 p-4">
            <div
              className="flex w-full items-center justify-center overflow-hidden rounded-xl shadow-xl transition-[background] duration-300"
              style={{
                background: backgroundCss(background),
                aspectRatio: validSize ? `${width} / ${height}` : "9 / 16",
                maxHeight: "22rem",
                maxWidth: validSize && width < height ? `calc(22rem * ${width / height})` : undefined,
              }}
            >
              <QuranHeart memorized={memorized} palette={exportPalette(highlight)} className="h-[92%] w-[92%]" />
            </div>
          </div>

          <form className="space-y-6" onSubmit={e => { e.preventDefault(); submit(); }}>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-emerald-950">لون الخلفية</legend>
              <div className="grid grid-cols-8 gap-2">
                {BACKGROUNDS.map(bg => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => chooseBackground(bg)}
                    aria-label={bg.label}
                    title={bg.label}
                    aria-pressed={bg.id === background.id}
                    style={{ background: backgroundCss(bg) }}
                    className={`aspect-square rounded-xl transition hover:scale-105 ${
                      bg.id === background.id ? "ring-2 ring-emerald-600 ring-offset-2" : ""
                    }`}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-emerald-950">لون السور المحفوظة</legend>
              <div className="grid grid-cols-8 gap-2">
                {HIGHLIGHTS.map(({ label, color }) => {
                  const active = color.toLowerCase() === highlight.toLowerCase();
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => chooseHighlight(color)}
                      aria-label={label}
                      title={label}
                      aria-pressed={active}
                      style={{ background: color }}
                      className={`aspect-square rounded-full transition hover:scale-105 ${active ? "ring-2 ring-emerald-600 ring-offset-2" : ""}`}
                    />
                  );
                })}
                {/* Any other colour */}
                <label
                  title="لون آخر"
                  style={isCustomHighlight ? { background: highlight } : undefined}
                  className={`relative flex aspect-square cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition hover:scale-105 ${
                    isCustomHighlight ? "border-transparent ring-2 ring-emerald-600 ring-offset-2" : "border-emerald-900/20 text-emerald-900/50"
                  }`}
                >
                  {!isCustomHighlight && <Pipette className="h-4 w-4" />}
                  <span className="sr-only">لون آخر</span>
                  <input
                    type="color"
                    value={highlight}
                    onChange={e => chooseHighlight(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-emerald-950">الحجم</legend>
              <div className="grid grid-cols-2 gap-2">
                {SIZES.map(size => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => { setSizeId(size.id); setError(""); }}
                    aria-pressed={sizeId === size.id}
                    className={`rounded-2xl border px-3 py-2.5 text-start transition ${
                      sizeId === size.id
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                        : "border-emerald-900/10 hover:border-emerald-300"
                    }`}
                  >
                    <span className="block text-sm font-medium">{size.label}</span>
                    <span className="block text-xs text-emerald-900/50" dir="ltr">
                      {size.id === "custom" ? "…" : `${size.w} × ${size.h}`}
                    </span>
                  </button>
                ))}
              </div>
              {sizeId === "custom" && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <SizeInput label="العرض (بكسل)" value={custom.w} onChange={w => { setCustom(c => ({ ...c, w })); setError(""); }} />
                  <SizeInput label="الارتفاع (بكسل)" value={custom.h} onChange={h => { setCustom(c => ({ ...c, h })); setError(""); }} />
                </div>
              )}
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-emerald-950">نوع الملف</legend>
              <div className="flex gap-1 rounded-full bg-emerald-50 p-1">
                {(["png", "jpg", "svg"] as const).map(t => (
                  <button key={t} type="button" onClick={() => setType(t)} aria-pressed={type === t}
                    className={`flex-1 rounded-full py-1.5 text-sm font-semibold uppercase transition ${
                      type === t ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-900/60 hover:text-emerald-900"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

            <button type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 py-3.5 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800">
              <Download className="h-5 w-5" />
              تحميل الصورة
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SizeInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-emerald-900/60">{label}</span>
      <input type="number" inputMode="numeric" min={MIN_SIZE} max={MAX_SIZE} value={value} dir="ltr"
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-emerald-900/10 px-3 py-2 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
    </label>
  );
}
