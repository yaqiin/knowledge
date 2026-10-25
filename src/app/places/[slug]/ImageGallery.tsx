"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Lightbox } from "./Lightbox";
import { Thumbnails } from "./Thumbnails";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  // In RTL, "next" moves visually leftwards
  const next = () => setIndex(i => (i + 1) % images.length);
  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);

  if (!images.length) return null;

  return (
    <div
      className="outline-none"
      tabIndex={0}
      onKeyDown={e => {
        // Key events from the full-screen viewer bubble here through the React portal; it handles its own
        if (fullscreen) return;
        if (e.key === "ArrowLeft") next();
        if (e.key === "ArrowRight") prev();
      }}
      aria-roledescription="معرض صور"
      aria-label={alt}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-emerald-100 shadow-2xl shadow-emerald-900/10">
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="block h-full w-full cursor-zoom-in"
          aria-label="عرض الصورة بملء الشاشة"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images hosted on GitHub */}
          <img src={images[index]} alt={`${alt} - صورة ${index + 1}`} className="h-full w-full object-cover" />
        </button>
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-emerald-900 shadow-lg backdrop-blur transition hover:bg-white"
          aria-label="ملء الشاشة"
          title="ملء الشاشة"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
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

      {images.length > 1 && <Thumbnails images={images} index={index} onSelect={setIndex} className="mt-3" />}

      {fullscreen && (
        <Lightbox images={images} alt={alt} index={index} onIndexChange={setIndex} onClose={() => setFullscreen(false)} />
      )}
    </div>
  );
}
