"use client";

import { Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../storage";
import { DownloadButtons, ThemePicker } from "../habits/controls";
import { DEFAULT_THEME, THEMES } from "../habits/sheet";
import { buildChallengeSheet, DEFAULT_TITLE, MAX_GOAL_LENGTH, MAX_GOALS } from "./sheet";

const STORAGE_KEY = "challenge";

interface Saved {
  title: string;
  goals: string[];
  theme: string;
}

const emptyGoals = () => Array<string>(MAX_GOALS).fill("");

export function ChallengeBuilder() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [goals, setGoals] = useState(emptyGoals);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loaded, setLoaded] = useState(false);

  // Restore the last sheet after hydration (the server renders the defaults)
  useEffect(() => {
    try {
      const saved = JSON.parse(readStorage(STORAGE_KEY) ?? "null") as Partial<Saved> | null;
      if (saved) {
        if (typeof saved.title === "string") setTitle(saved.title);
        if (Array.isArray(saved.goals)) {
          setGoals(emptyGoals().map((_, i) => (typeof saved.goals![i] === "string" ? saved.goals![i] : "")));
        }
        if (THEMES.some(t => t.id === saved.theme)) setTheme(saved.theme as string);
      }
    } catch {
      // corrupted value: keep the defaults
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeStorage(STORAGE_KEY, JSON.stringify({ title, goals, theme } satisfies Saved));
  }, [title, goals, theme, loaded]);

  const preview = useMemo(() => buildChallengeSheet({ title, goals, theme }).markup, [title, goals, theme]);

  const setGoal = (index: number, value: string) => setGoals(prev => prev.map((g, i) => (i === index ? value : g)));

  return (
    <div className="container mx-auto grid gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[24rem_1fr] lg:items-start">
      <section className="space-y-7 rounded-3xl border border-emerald-900/5 bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-display text-lg font-bold text-emerald-950">أهدافك</h2>
          <p className="mt-1 text-sm text-emerald-900/60">اكتبها هنا، أو اتركها فارغة لتكتبها بخط يدك.</p>
          <div className="mt-3 space-y-2">
            {goals.map((goal, i) => (
              <label key={i} className="flex items-center gap-2">
                <Target className="h-5 w-5 shrink-0 text-emerald-600" />
                <span className="sr-only">الهدف {i + 1}</span>
                <input
                  value={goal}
                  onChange={e => setGoal(i, e.target.value)}
                  maxLength={MAX_GOAL_LENGTH}
                  placeholder={`الهدف ${i + 1}`}
                  className="w-full rounded-full border border-emerald-900/10 px-4 py-2 text-sm outline-none transition placeholder:text-emerald-900/40 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
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
            build={fontCss => buildChallengeSheet({ title, goals, theme }, fontCss)}
            name={title.trim() || "تحدي-90-يوماً"}
          />
        </div>

        <div className="mt-4 rounded-2xl bg-emerald-50/60 p-3 sm:p-5">
          <div
            className="mx-auto max-w-[34rem] overflow-hidden rounded-lg bg-white shadow-xl shadow-emerald-900/10 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
            aria-label="معاينة جدول تحدي 90 يوماً"
            role="img"
            // Our own generated SVG; user text is escaped in buildChallengeSheet
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </section>
    </div>
  );
}
