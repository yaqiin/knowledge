"use client";

import { useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../storage";
import { DownloadButtons, ThemePicker } from "../habits/controls";
import { DEFAULT_THEME, THEMES } from "../habits/sheet";
import {
  AREAS, buildWheelSheet, defaultScores, DEFAULT_TITLE, MAX_PRIORITIES, MAX_SCORE, type AreaId, type Scores,
} from "./sheet";

const STORAGE_KEY = "wheel";

interface Saved {
  title: string;
  scores: Scores;
  blank: boolean;
  priorities: AreaId[];
  theme: string;
}

const isAreaId = (id: unknown): id is AreaId => AREAS.some(a => a.id === id);

export function WheelBuilder() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [scores, setScores] = useState(defaultScores);
  const [blank, setBlank] = useState(false);
  const [priorities, setPriorities] = useState<AreaId[]>([]);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loaded, setLoaded] = useState(false);

  // Restore the last wheel after hydration (the server renders the defaults)
  useEffect(() => {
    try {
      const saved = JSON.parse(readStorage(STORAGE_KEY) ?? "null") as Partial<Saved> | null;
      if (saved) {
        if (typeof saved.title === "string") setTitle(saved.title);
        if (saved.scores && typeof saved.scores === "object") {
          const restored = defaultScores();
          for (const { id } of AREAS) {
            const score = saved.scores[id];
            if (Number.isInteger(score) && score >= 1 && score <= MAX_SCORE) restored[id] = score;
          }
          setScores(restored);
        }
        if (typeof saved.blank === "boolean") setBlank(saved.blank);
        if (Array.isArray(saved.priorities)) setPriorities([...new Set(saved.priorities.filter(isAreaId))].slice(0, MAX_PRIORITIES));
        if (THEMES.some(t => t.id === saved.theme)) setTheme(saved.theme as string);
      }
    } catch {
      // corrupted value: keep the defaults
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeStorage(STORAGE_KEY, JSON.stringify({ title, scores, blank, priorities, theme } satisfies Saved));
  }, [title, scores, blank, priorities, theme, loaded]);

  const preview = useMemo(
    () => buildWheelSheet({ title, scores, blank, priorities, theme }).markup,
    [title, scores, blank, priorities, theme],
  );
  const full = priorities.length >= MAX_PRIORITIES;

  const togglePriority = (id: AreaId) => setPriorities(prev => {
    if (prev.includes(id)) return prev.filter(p => p !== id);
    return prev.length >= MAX_PRIORITIES ? prev : [...prev, id];
  });

  return (
    <div className="container mx-auto grid gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[24rem_1fr] lg:items-start">
      <section className="space-y-7 rounded-3xl border border-emerald-900/5 bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-display text-lg font-bold text-emerald-950">قيّم كل جانب</h2>
          <p className="mt-1 text-sm text-emerald-900/60">من 1 إلى {MAX_SCORE}: كم أنت راضٍ عن هذا الجانب اليوم؟</p>
          <div className={`mt-4 space-y-3 transition ${blank ? "pointer-events-none opacity-40" : ""}`}>
            {AREAS.map(area => (
              <label key={area.id} className="block">
                <span className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-emerald-950">{area.label}</span>
                  <span className="font-bold tabular-nums text-amber-600">{scores[area.id]}</span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={MAX_SCORE}
                  value={scores[area.id]}
                  disabled={blank}
                  onChange={e => setScores(prev => ({ ...prev, [area.id]: Number(e.target.value) }))}
                  className="mt-1 w-full accent-emerald-600"
                />
              </label>
            ))}
          </div>
          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <input
              type="checkbox"
              checked={blank}
              onChange={e => setBlank(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            عجلة فارغة لألوّنها بيدي
          </label>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-emerald-950">أولوياتك</h2>
            <span className="text-sm text-emerald-900/50">{priorities.length} / {MAX_PRIORITIES}</span>
          </div>
          <p className="mt-1 text-sm text-emerald-900/60">
            {priorities.length
              ? "تظهر في الجدول بترتيب اختيارك."
              : blank
                ? `اختر حتى ${MAX_PRIORITIES} جوانب، أو اتركها فارغة لتكتبها بيدك.`
                : `اختر حتى ${MAX_PRIORITIES} جوانب، أو نضع لك الأضعف تلقائياً.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {AREAS.map(area => {
              const order = priorities.indexOf(area.id);
              const on = order >= 0;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => togglePriority(area.id)}
                  aria-pressed={on}
                  disabled={!on && full}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${on
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-emerald-900/10 bg-white text-emerald-900 hover:border-emerald-300 hover:bg-emerald-50"}`}
                >
                  {on && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700">
                      {order + 1}
                    </span>
                  )}
                  {area.label}
                </button>
              );
            })}
          </div>
        </div>

        <ThemePicker theme={theme} onChange={setTheme} />

        <label className="block">
          <span className="font-display text-lg font-bold text-emerald-950">العنوان</span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={40}
            placeholder={DEFAULT_TITLE}
            className="mt-3 w-full rounded-2xl border border-emerald-900/10 px-4 py-2.5 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </section>

      <section className="min-w-0 rounded-3xl border border-emerald-900/5 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-bold text-emerald-950">معاينة العجلة</h2>
          <DownloadButtons
            build={fontCss => buildWheelSheet({ title, scores, blank, priorities, theme }, fontCss)}
            name={title.trim() || "عجلة-الحياة"}
          />
        </div>

        <div className="mt-4 rounded-2xl bg-emerald-50/60 p-3 sm:p-5">
          <div
            className="mx-auto max-w-[34rem] overflow-hidden rounded-lg bg-white shadow-xl shadow-emerald-900/10 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
            aria-label="معاينة عجلة الحياة"
            role="img"
            // Our own generated SVG; user text is escaped in buildWheelSheet
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </section>
    </div>
  );
}
