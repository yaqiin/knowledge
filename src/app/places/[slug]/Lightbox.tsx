"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Thumbnails } from "./Thumbnails";

const SWIPE_THRESHOLD = 50;

/**
 * Full-screen image viewer. Uses the browser's Fullscreen API when available (hides the browser UI);
 * otherwise, e.g. on iPhone, it still covers the whole window.
 */
export function Lightbox({ images, alt, index, onIndexChange, onClose }: {
  images: string[];
  alt: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  // Latest values for the long-lived listeners below
  const state = useRef({ index, onIndexChange, onClose });
  state.current = { index, onIndexChange, onClose };

  const next = () => onIndexChange((index + 1) % images.length);
  const prev = () => onIndexChange((index - 1 + images.length) % images.length);

  useEffect(() => {
    const root = rootRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Pressing Esc in browser full screen exits full screen without a keydown event,
    // so treat leaving full screen as closing the viewer
    let enteredFullscreen = false;
    const onFullscreenChange = () => {
      if (document.fullscreenElement === root) enteredFullscreen = true;
      else if (enteredFullscreen) state.current.onClose();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    root?.requestFullscreen?.().catch(() => {
      // Not allowed or unsupported: the fixed overlay already covers the window
    });

    const onKey = (e: KeyboardEvent) => {
      const { index: i, onIndexChange: setIndex, onClose: close } = state.current;
      if (e.key === "Escape") close();
      // RTL: left arrow goes forward
      else if (e.key === "ArrowLeft") setIndex((i + 1) % images.length);
      else if (e.key === "ArrowRight") setIndex((i - 1 + images.length) % images.length);
      else return;
      e.preventDefault();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [images.length]);

  const navButton = "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} - عرض بملء الشاشة`}
      className="fixed inset-0 z-[70] flex flex-col overscroll-none bg-black text-white"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="flex min-w-0 items-baseline gap-3 text-sm">
          <span className="truncate font-semibold">{alt}</span>
          {images.length > 1 && <span className="shrink-0 text-white/60" dir="ltr">{index + 1} / {images.length}</span>}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="إغلاق العرض بملء الشاشة"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* touch-pan-y: horizontal swipes are ours, otherwise the browser may treat them as "go back" */}
      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          // RTL: the next image sits to the left, so swiping right brings it in
          if (dx > SWIPE_THRESHOLD) next();
          else if (dx < -SWIPE_THRESHOLD) prev();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images hosted on GitHub */}
        <img
          key={images[index]}
          src={images[index]}
          alt={`${alt} - صورة ${index + 1}`}
          className="max-h-full max-w-full select-none object-contain"
          draggable={false}
        />
        {images.length > 1 && (
          <>
            <button type="button" onClick={prev} aria-label="الصورة السابقة" className={`${navButton} start-3 sm:start-5`}>
              <ChevronRight className="h-6 w-6" />
            </button>
            <button type="button" onClick={next} aria-label="الصورة التالية" className={`${navButton} end-3 sm:end-5`}>
              <ChevronLeft className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <Thumbnails images={images} index={index} onSelect={onIndexChange} dark className="px-4 pb-4 pt-3 sm:px-6" />
      )}
    </div>,
    document.body,
  );
}
