import { GeometricPattern } from "./GeometricPattern";

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-emerald-900/5 bg-gradient-to-b from-emerald-50 to-white py-14 sm:py-20">
      <GeometricPattern className="absolute inset-0 -z-10 h-full w-full text-emerald-900/[0.05]" />
      <div className="container mx-auto px-4 text-center sm:px-6">
        <span className="text-sm font-semibold text-amber-600">{eyebrow}</span>
        <h1 className="mt-3 font-display text-3xl font-bold leading-snug text-emerald-950 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-emerald-900/70">{subtitle}</p>}
      </div>
    </section>
  );
}
