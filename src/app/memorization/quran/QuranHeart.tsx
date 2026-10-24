"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { HEART, SITE_COLORS, SURAH_NAMES, type HeartPalette } from "./heart";

export interface QuranHeartHandle {
  /** Scrolls a surah into view */
  reveal: (id: string) => void;
}

/**
 * The heart drawn from the shape data. Interactive when `onToggle` is given;
 * otherwise a static picture (used for the export preview).
 */
export const QuranHeart = forwardRef<QuranHeartHandle, {
  memorized: Set<string>;
  onToggle?: (id: string) => void;
  highlighted?: string | null;
  palette?: HeartPalette;
  className?: string;
  style?: React.CSSProperties;
}>(function QuranHeart({ memorized, onToggle, highlighted, palette = SITE_COLORS, className, style }, ref) {
  const groups = useRef(new Map<string, SVGGElement>());

  useImperativeHandle(ref, () => ({
    reveal: id => groups.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }),
  }));

  const interactive = Boolean(onToggle);

  return (
    <svg
      viewBox={HEART.viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={style}
      role={interactive ? "group" : "img"}
      aria-label="قلب سور القرآن الكريم"
    >
      {HEART.shapes.map(({ id, paths, x, y }) => {
        const done = memorized.has(id);
        const name = SURAH_NAMES.get(id) ?? "";
        const isHighlighted = highlighted === id;
        return (
          <g
            key={id}
            ref={el => {
              if (el) groups.current.set(id, el);
              else groups.current.delete(id);
            }}
            {...(interactive && {
              role: "button",
              tabIndex: 0,
              "aria-pressed": done,
              "aria-label": `سورة ${name}`,
              onClick: () => onToggle!(id),
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle!(id);
                }
              },
            })}
            className={interactive ? "group/surah cursor-pointer outline-none" : undefined}
          >
            {paths.map(d => (
              <path
                key={d}
                d={d}
                fill={done ? palette.surahDone : palette.surah}
                stroke={isHighlighted ? "#f59e0b" : palette.border}
                strokeWidth={isHighlighted ? 4 : palette.border ? 1.6 : undefined}
                strokeLinejoin="round"
                className={interactive
                  ? `transition-[fill] duration-200 ${done ? "" : "group-hover/surah:fill-emerald-100"} group-focus-visible/surah:stroke-amber-500 group-focus-visible/surah:[stroke-width:3]`
                  : undefined}
              />
            ))}
            <text
              x={x}
              y={y}
              fill={done ? palette.labelDone : palette.label}
              className="pointer-events-none select-none text-[9px] font-bold"
            >
              {name}
            </text>
          </g>
        );
      })}
    </svg>
  );
});
