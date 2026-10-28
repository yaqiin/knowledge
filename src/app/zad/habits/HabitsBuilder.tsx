"use client";

import { Check, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { readStorage, writeStorage } from "../storage";
import { DownloadButtons, ThemePicker } from "./controls";
import {
  DEFAULT_HABITS, DEFAULT_TITLE, MAX_HABIT_LENGTH, MAX_HABITS, PERIODS, PRESET_HABITS, type PeriodDays,
} from "./presets";
import { buildSheet, DEFAULT_THEME, THEMES } from "./sheet";

const STORAGE_KEY = "habits";

interface Saved {
  selected: string[];
  custom: string[];
  days: PeriodDays;
  title: string;
  theme: string;
}

export function HabitsBuilder() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_HABITS);
  const [custom, setCustom] = useState<string[]>([]);
  const [days, setDays] = useState<PeriodDays>(30);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Restore the last sheet after hydration (the server renders the defaults)
  useEffect(() => {
    try {
      const saved = JSON.parse(readStorage(STORAGE_KEY) ?? "null") as Partial<Saved> | null;
      if (saved) {
        if (Array.isArray(saved.custom)) setCustom(saved.custom.filter(h => typeof h === "string"));
        if (Array.isArray(saved.selected)) setSelected(saved.selected.filter(h => typeof h === "string"));
        if (PERIODS.some(p => p.days === saved.days)) setDays(saved.days as PeriodDays);
        if (typeof saved.title === "string") setTitle(saved.title);
        if (THEMES.some(t => t.id === saved.theme)) setTheme(saved.theme as string);
      }
    } catch {
      // corrupted value: keep the defaults
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeStorage(STORAGE_KEY, JSON.stringify({ selected, custom, days, title, theme } satisfies Saved));
  }, [selected, custom, days, title, theme, loaded]);

  const allHabits = useMemo(() => [...PRESET_HABITS, ...custom], [custom]);
  // Sheet order follows the list order, not the order of tapping
  const habits = useMemo(() => allHabits.filter(h => selected.includes(h)), [allHabits, selected]);
  const preview = useMemo(() => buildSheet({ title, habits, days, theme }).markup, [title, habits, days, theme]);
  const full = habits.length >= MAX_HABITS;

  const toggle = (habit: string) => {
    setError("");
    setSelected(prev => {
      if (prev.includes(habit)) return prev.filter(h => h !== habit);
      if (prev.length >= MAX_HABITS) return prev;
      return [...prev, habit];
    });
  };

  const addCustom = (e: FormEvent) => {
    e.preventDefault();
    const habit = draft.trim().replace(/\s+/g, " ");
    if (!habit) return;
    if (allHabits.includes(habit)) {
      if (!selected.includes(habit)) toggle(habit);
      setDraft("");
      return;
    }
    if (full) {
      setError(`يمكنك اختيار ${MAX_HABITS} عادة كحد أقصى.`);
      return;
    }
    setCustom(prev => [...prev, habit]);
    setSelected(prev => [...prev, habit]);
    setDraft("");
  };

  const removeCustom = (habit: string) => {
    setCustom(prev => prev.filter(h => h !== habit));
    setSelected(prev => prev.filter(h => h !== habit));
  };

  return (
    <div className="container mx-auto grid gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[24rem_1fr] lg:items-start">
      <section className="space-y-7 rounded-3xl border border-emerald-900/5 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-emerald-950">عاداتك</h2>
            <span className="text-sm text-emerald-900/50">{habits.length} / {MAX_HABITS}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {allHabits.map(habit => {
              const on = selected.includes(habit);
              const isCustom = custom.includes(habit);
              return (
                <span key={habit} className="inline-flex">
                  <button
                    type="button"
                    onClick={() => toggle(habit)}
                    aria-pressed={on}
                    disabled={!on && full}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      isCustom ? "rounded-e-none border-e-0" : ""
                    } ${on
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-emerald-900/10 bg-white text-emerald-900 hover:border-emerald-300 hover:bg-emerald-50"}`}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                    {habit}
                  </button>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => removeCustom(habit)}
                      aria-label={`حذف ${habit}`}
                      className={`inline-flex items-center rounded-e-full border px-2 transition ${on
                        ? "border-emerald-600 bg-emerald-700 text-white hover:bg-emerald-800"
                        : "border-emerald-900/10 bg-white text-emerald-900/50 hover:bg-rose-50 hover:text-rose-700"}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </span>
              );
            })}
          </div>

          <form onSubmit={addCustom} className="mt-4 flex gap-2">
            <label className="flex-1">
              <span className="sr-only">أضف عادة</span>
              <input
                value={draft}
                onChange={e => { setDraft(e.target.value); setError(""); }}
                maxLength={MAX_HABIT_LENGTH}
                placeholder="أضف عادة أخرى..."
                className="w-full rounded-full border border-emerald-900/10 px-4 py-2.5 text-sm outline-none transition placeholder:text-emerald-900/40 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="إضافة"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-40"
            >
              <Plus className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-emerald-950">المدة</h2>
          <div className="mt-3 flex gap-1 rounded-full bg-emerald-50 p-1" role="group" aria-label="المدة">
            {PERIODS.map(p => (
              <button
                key={p.days}
                type="button"
                onClick={() => setDays(p.days)}
                aria-pressed={days === p.days}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
                  days === p.days ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-900/60 hover:text-emerald-900"
                }`}
              >
                {p.label}
              </button>
            ))}
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
          <h2 className="font-display text-lg font-bold text-emerald-950">معاينة الجدول</h2>
          <DownloadButtons
            build={habits.length ? fontCss => buildSheet({ title, habits, days, theme }, fontCss) : null}
            name={title.trim() || "جدول-العادات"}
          />
        </div>

        {error && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <div className="mt-4 rounded-2xl bg-emerald-50/60 p-3 sm:p-5">
          {habits.length ? (
            <div
              className="mx-auto overflow-hidden rounded-lg bg-white shadow-xl shadow-emerald-900/10 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
              style={{ maxWidth: days > 7 ? "100%" : "34rem" }}
              aria-label="معاينة جدول العادات"
              role="img"
              // Our own generated SVG; user text is escaped in buildSheet
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          ) : (
            <p className="py-20 text-center text-emerald-900/50">اختر عادة واحدة على الأقل لإنشاء الجدول.</p>
          )}
        </div>
      </section>
    </div>
  );
}
