"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

/**
 * A dropdown with a styled open list, which a native <select> can't have.
 * Follows the ARIA select-only combobox pattern: focus stays on the button, and arrow keys move the active option.
 */
export function FilterSelect({ label, allLabel, options, value, onChange }: {
  label: string;
  /** The first option, which clears the filter */
  allLabel: string;
  options: { id: string; name: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const items = [{ id: null, name: allLabel }, ...options];
  const selectedIndex = Math.max(0, items.findIndex(item => item.id === value));

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const closeIfOutside = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeIfOutside);
    return () => document.removeEventListener("pointerdown", closeIfOutside);
  }, [open]);

  const openList = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(items[index].id);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (open) setOpen(false);
      return;
    }
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    const moves: Record<string, number> = {
      ArrowDown: (activeIndex + 1) % items.length,
      ArrowUp: (activeIndex - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    if (e.key in moves) {
      e.preventDefault();
      setActiveIndex(moves[e.key]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(activeIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative min-w-0 sm:w-44">
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex h-12 w-full items-center justify-between gap-2 rounded-full border pe-3 ps-4 text-sm font-medium shadow-sm outline-none transition focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-100 ${
          value
            ? "border-emerald-700 bg-emerald-50 text-emerald-800"
            : "border-emerald-900/10 bg-white text-emerald-900/70 hover:border-emerald-300"
        } ${open ? "ring-4 ring-emerald-100" : ""}`}
      >
        <span className="truncate">{items[selectedIndex].name}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-emerald-900/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-label={label}
        hidden={!open}
        className="absolute inset-x-0 top-full z-50 mt-2 space-y-0.5 rounded-2xl border border-emerald-900/10 bg-white p-1.5 shadow-xl shadow-emerald-950/10"
      >
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <li
              key={item.name}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={selected}
              onMouseEnter={() => setActiveIndex(index)}
              // Keeps focus on the button, so the keyboard still works after clicking
              onMouseDown={e => e.preventDefault()}
              onClick={() => choose(index)}
              className={`flex min-h-10 cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                index === activeIndex ? "bg-emerald-50" : ""
              } ${selected ? "font-semibold text-emerald-800" : "text-emerald-900/70"}`}
            >
              <span>{item.name}</span>
              {selected && <Check className="h-4 w-4 shrink-0 text-emerald-700" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
