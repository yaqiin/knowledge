"use client";

import { ArrowLeft, BookHeart, Clock } from "lucide-react";
import Link from "next/link";
import { COLLECTIONS, UPCOMING, collectionHref, type Collection } from "../collections";
import { useMemorized } from "../storage";
import { ProgressBar, progressText } from "./ProgressBar";

export function CollectionCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {COLLECTIONS.map(collection => <CollectionCard key={collection.slug} collection={collection} />)}
      {UPCOMING.map(({ title, description }) => (
        <div key={title} className="rounded-3xl border border-dashed border-emerald-900/15 bg-emerald-50/30 p-7">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-900/30">
              <BookHeart className="h-6 w-6" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              <Clock className="h-3.5 w-3.5" />
              قريباً
            </span>
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-emerald-950/60">{title}</h2>
          <p className="mt-2 leading-relaxed text-emerald-900/50">{description}</p>
        </div>
      ))}
    </div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  const { memorized } = useMemorized(collection.slug);
  const total = collection.items.length;
  const started = memorized.size > 0;

  return (
    <Link
      href={collectionHref(collection.slug)}
      className="group flex flex-col rounded-3xl border border-emerald-900/5 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg">
        <BookHeart className="h-6 w-6" />
      </span>
      <h2 className="mt-5 font-display text-xl font-bold text-emerald-950">{collection.title}</h2>
      <p className="mt-2 flex-1 leading-relaxed text-emerald-900/70">{collection.description}</p>

      <div className="mt-6">
        <p className="mb-2 text-sm text-emerald-900/60">
          حفظت {progressText(memorized.size, total, collection.itemForms)}
        </p>
        <ProgressBar count={memorized.size} total={total} label={`تقدم الحفظ في ${collection.title}`} />
      </div>

      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
        {started ? "تابع الحفظ" : "ابدأ"}
        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
