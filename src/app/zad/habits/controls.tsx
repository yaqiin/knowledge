"use client";

import { Check, FileText, ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { downloadImage, downloadPdf, type SheetBuilder } from "./export";
import { THEMES } from "./sheet";

/** Color swatches shared by the printable planners. */
export function ThemePicker({ theme, onChange }: { theme: string; onChange: (id: string) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-emerald-950">اللون</h2>
        <span className="text-sm text-emerald-900/50">{THEMES.find(t => t.id === theme)?.label}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3" role="group" aria-label="لون الجدول">
        {THEMES.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-pressed={theme === t.id}
            aria-label={t.label}
            title={t.label}
            style={{ background: `linear-gradient(135deg, ${t.header} 50%, ${t.circle} 50%)` }}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:scale-110 ${
              theme === t.id ? "ring-2 ring-emerald-950 ring-offset-2" : ""
            }`}
          >
            {theme === t.id && <Check className="h-4 w-4 drop-shadow" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/** The PDF / image buttons plus their error message. `build` is null while there is nothing to print. */
export function DownloadButtons({ build, name }: { build: SheetBuilder | null; name: string }) {
  const [busy, setBusy] = useState<"pdf" | "image" | null>(null);
  const [error, setError] = useState("");

  const download = async (kind: "pdf" | "image") => {
    if (!build) return;
    setBusy(kind);
    setError("");
    try {
      await (kind === "pdf" ? downloadPdf(build, name) : downloadImage(build, name));
    } catch {
      setError("تعذّر إنشاء الملف، حاول مرة أخرى.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <DownloadButton
          primary
          icon={<FileText className="h-4 w-4" />}
          label="تحميل PDF"
          busy={busy === "pdf"}
          disabled={!build || busy !== null}
          onClick={() => download("pdf")}
        />
        <DownloadButton
          icon={<ImageIcon className="h-4 w-4" />}
          label="تحميل صورة"
          busy={busy === "image"}
          disabled={!build || busy !== null}
          onClick={() => download("image")}
        />
      </div>
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:basis-full">{error}</p>}
    </>
  );
}

function DownloadButton({ primary = false, icon, label, busy, disabled, onClick }: {
  primary?: boolean;
  icon: React.ReactNode;
  label: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 sm:flex-none ${
        primary
          ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800"
          : "border border-emerald-900/10 text-emerald-900 hover:bg-emerald-50"
      }`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {busy ? "جارٍ التحضير…" : label}
    </button>
  );
}
