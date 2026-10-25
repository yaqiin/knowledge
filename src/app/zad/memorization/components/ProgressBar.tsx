import { arabicCount, type CountForms } from "@/lib/data";

export function progressText(count: number, total: number, forms: CountForms) {
  return `${count === 0 ? "0" : arabicCount(count, forms)} من ${total}`;
}

export function ProgressBar({ count, total, label }: { count: number; total: number; label: string }) {
  const percent = total ? Math.round((count / total) * 100) : 0;
  return (
    <div
      className="h-2.5 overflow-hidden rounded-full bg-emerald-100"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={count}
      aria-label={label}
    >
      <div
        className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-emerald-700 transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
