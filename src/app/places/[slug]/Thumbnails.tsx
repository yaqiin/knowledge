"use client";

import { useEffect, useRef } from "react";

/** Horizontal thumbnail strip that keeps the active thumbnail centred. */
export function Thumbnails({ images, index, onSelect, dark = false, className = "" }: {
  images: string[];
  index: number;
  onSelect: (index: number) => void;
  /** Style for the full-screen viewer's black background */
  dark?: boolean;
  className?: string;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scrolls only the strip (not the page, unlike scrollIntoView); scrollBy is relative,
  // so it behaves the same in RTL and LTR.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[index];
    if (!strip || !thumb) return;
    const stripBox = strip.getBoundingClientRect();
    const thumbBox = thumb.getBoundingClientRect();
    const offset = thumbBox.left + thumbBox.width / 2 - (stripBox.left + stripBox.width / 2);
    strip.scrollBy({ left: offset, behavior: "smooth" });
  }, [index]);

  const activeRing = dark ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "ring-4 ring-emerald-500";

  return (
    // Padding leaves room for the active thumbnail's ring, which the scroll area would otherwise clip.
    // Auto margins on the ends centre the thumbnails when they fit, and collapse when they overflow.
    // overscroll-x-contain: scrolling past the end mustn't turn into the browser's "go back" gesture.
    <div ref={stripRef} className={`flex gap-3 overflow-x-auto overscroll-x-contain p-1.5 ${dark ? "[&>:first-child]:ms-auto [&>:last-child]:me-auto" : ""} ${className}`}>
      {images.map((image, i) => (
        <button
          key={image}
          ref={el => { thumbRefs.current[i] = el; }}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`عرض الصورة ${i + 1}`}
          aria-current={i === index}
          className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl transition sm:h-20 sm:w-32 ${
            i === index ? activeRing : "opacity-50 hover:opacity-100"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images hosted on GitHub */}
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}
