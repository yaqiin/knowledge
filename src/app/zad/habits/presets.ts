/** Suggested habits; the first DEFAULT_COUNT are selected for first-time visitors. */
export const PRESET_HABITS = [
  "ورد القرآن",
  "أذكار الصباح",
  "أذكار المساء",
  "السنن الرواتب",
  "صلاة الوتر",
  "صلاة الضحى",
  "قيام الليل",
  "الاستغفار",
  "الصدقة",
  "صيام التطوع",
  "صلة الرحم",
  "قراءة كتاب",
];

const DEFAULT_COUNT = 5;
export const DEFAULT_HABITS = PRESET_HABITS.slice(0, DEFAULT_COUNT);

/** Most habits that still fit legibly on one page */
export const MAX_HABITS = 12;
export const MAX_HABIT_LENGTH = 24;

export const PERIODS = [
  { days: 30, label: "30 يوماً" },
  { days: 7, label: "7 أيام" },
] as const;

export type PeriodDays = (typeof PERIODS)[number]["days"];

export const DEFAULT_TITLE = "جدول عاداتي";
