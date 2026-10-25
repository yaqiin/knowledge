"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // In RTL, "next" moves visually leftwards
  const next = () => setIndex(i => (i + 1) % images.length);
  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);

  // Keep the active thumbnail centred in the strip. Scrolls only the strip (not the page, unlike
  // scrollIntoView); scrollBy is relative, so it behaves the same in RTL and LTR.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[index];
    if (!strip || !thumb) return;
    const stripBox = strip.getBoundingClientRect();
    const thumbBox = thumb.getBoundingClientRect();
    const offset = thumbBox.left + thumbBox.width / 2 - (stripBox.left + stripBox.width / 2);
    strip.scrollBy({ left: offset, behavior: "smooth" });
  }, [index]);

  if (!images.length) return null;

  return (
    <div
      className="outline-none"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "ArrowLeft") next();
        if (e.key === "ArrowRight") prev();
      }}
      aria-roledescription="معرض صور"
      aria-label={alt}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-emerald-100 shadow-2xl shadow-emerald-900/10">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images hosted on GitHub */}
        <img src={images[index]} alt={`${alt} - صورة ${index + 1}`} className="h-full w-full object-cover" />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute start-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-900 shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="الصورة السابقة"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute end-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-900 shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="الصورة التالية"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="absolute bottom-4 end-4 rounded-full bg-emerald-950/70 px-3 py-1 text-xs font-medium text-white">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        // Padding leaves room for the active thumbnail's ring, which the scroll area would otherwise clip
        <div ref={stripRef} className="mt-3 flex gap-3 overflow-x-auto p-1.5">
          {images.map((image, i) => (
            <button
              key={image}
              ref={el => { thumbRefs.current[i] = el; }}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`عرض الصورة ${i + 1}`}
              aria-current={i === index}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl transition sm:h-20 sm:w-32 ${
                i === index ? "ring-4 ring-emerald-500" : "opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, images hosted on GitHub */}
              <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
