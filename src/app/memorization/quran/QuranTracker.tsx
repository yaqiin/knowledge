"use client";

import { Download, Heart, List, Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { QURAN } from "../collections";
import { ItemGrid } from "../components/ItemGrid";
import { ProgressBar, progressText } from "../components/ProgressBar";
import { useMemorized } from "../storage";
import { ExportDialog } from "./ExportDialog";
import { QuranHeart, type QuranHeartHandle } from "./QuranHeart";
import { SurahSearch } from "./SurahSearch";

type View = "heart" | "list";

const ZOOM = { min: 1, max: 3, step: 0.5 } as const;

export function QuranTracker() {
  const { memorized, toggle, clear } = useMemorized(QURAN.slug);
  const [view, setView] = useState<View>("heart");
  const [zoom, setZoom] = useState(1);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const heartRef = useRef<QuranHeartHandle>(null);

  const reveal = useCallback((id: string) => {
    setHighlighted(id);
    heartRef.current?.reveal(id);
  }, []);

  useEffect(() => {
    if (!highlighted) return;
    const timer = setTimeout(() => setHighlighted(null), 2000);
    return () => clearTimeout(timer);
  }, [highlighted]);

  const total = QURAN.items.length;
  const percent = Math.round((memorized.size / total) * 100);

  return (
    <div className="container mx-auto space-y-6 px-4 py-10 sm:px-6">
      {/* Progress and actions in one compact bar, so the heart gets the full width below */}
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-900/5 bg-white p-5 shadow-sm md:flex-row md:items-center md:gap-6">
        <div className="flex flex-1 items-center gap-5">
          <p className="shrink-0 font-display text-4xl font-black text-emerald-950">
            {percent}<span className="text-xl text-emerald-900/40">٪</span>
          </p>
          <div className="flex-1">
            <p className="mb-2 text-sm text-emerald-900/70" aria-live="polite">
              حفظت {progressText(memorized.size, total, QURAN.itemForms)} سورة
            </p>
            <ProgressBar count={memorized.size} total={total} label="نسبة السور المحفوظة" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <button
            type="button"
            onClick={() => setExporting(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 md:flex-none"
          >
            <Download className="h-4 w-4" />
            تحميل صورة محفوظاتي
          </button>
          <ClearButton disabled={memorized.size === 0} onConfirm={clear} />
        </div>
      </div>

      <section className="rounded-3xl border border-emerald-900/5 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 self-start rounded-full bg-emerald-50 p-1" role="group" aria-label="طريقة العرض">
            <ViewButton active={view === "heart"} onClick={() => setView("heart")} icon={<Heart className="h-4 w-4" />} label="القلب" />
            <ViewButton active={view === "list"} onClick={() => setView("list")} icon={<List className="h-4 w-4" />} label="القائمة" />
          </div>
          {view === "heart" && <SurahSearch memorized={memorized} onPick={reveal} />}
        </div>

        {view === "heart" ? (
          <div className="relative mt-4">
            <p className="mb-3 text-center text-sm text-emerald-900/50">
              انقر على السورة لتحديدها كمحفوظة، وانقر مرة أخرى لإلغاء التحديد.
            </p>
            {/* Laid out left-to-right like the source SVG; zoom enlarges it so the area scrolls */}
            <div dir="ltr" className="flex h-[min(88vh,960px)] min-h-[480px] overflow-auto rounded-2xl bg-gradient-to-b from-emerald-50/70 to-white">
              <QuranHeart
                ref={heartRef}
                memorized={memorized}
                onToggle={toggle}
                highlighted={highlighted}
                className="m-auto block h-auto shrink-0 p-4 transition-[width] duration-200"
                style={{ width: `calc(min(100%, (min(88vh, 960px) - 2rem) * 0.737) * ${zoom})` }}
              />
            </div>
            <div className="absolute bottom-3 end-3 flex flex-col gap-2">
              <ZoomButton label="تكبير" disabled={zoom >= ZOOM.max} onClick={() => setZoom(z => Math.min(ZOOM.max, z + ZOOM.step))}>
                <Plus className="h-5 w-5" />
              </ZoomButton>
              <ZoomButton label="تصغير" disabled={zoom <= ZOOM.min} onClick={() => setZoom(z => Math.max(ZOOM.min, z - ZOOM.step))}>
                <Minus className="h-5 w-5" />
              </ZoomButton>
              <ZoomButton label="إعادة الحجم" disabled={zoom === 1} onClick={() => setZoom(1)}>
                <RotateCcw className="h-5 w-5" />
              </ZoomButton>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <ItemGrid collection={QURAN} memorized={memorized} onToggle={toggle} />
          </div>
        )}
      </section>

      {exporting && <ExportDialog memorized={memorized} onClose={() => setExporting(false)} />}
    </div>
  );
}

function ViewButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-900/60 hover:text-emerald-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ZoomButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled: boolean; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-900/10 bg-white text-emerald-900 shadow-md transition hover:bg-emerald-50 disabled:opacity-40">
      {children}
    </button>
  );
}

/** Two-step "start over" so progress isn't wiped by a single misclick. */
function ClearButton({ disabled, onConfirm }: { disabled: boolean; onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-full border border-rose-200 bg-rose-50 py-1.5 pe-1.5 ps-4 text-sm">
        <span className="text-rose-800">مسح كل المحفوظات؟</span>
        <span className="flex gap-1">
          <button type="button" onClick={() => { onConfirm(); setConfirming(false); }}
            className="rounded-full bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-700">مسح</button>
          <button type="button" onClick={() => setConfirming(false)}
            className="rounded-full px-3 py-1.5 font-medium text-rose-800 hover:bg-rose-100">إلغاء</button>
        </span>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setConfirming(true)} disabled={disabled}
      className="shrink-0 rounded-full px-4 py-3 text-sm font-medium text-emerald-900/50 transition hover:bg-emerald-50 hover:text-emerald-900 disabled:pointer-events-none disabled:opacity-40">
      البدء من جديد
    </button>
  );
}
