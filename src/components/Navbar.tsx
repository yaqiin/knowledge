"use client";

import { ArrowUpLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LINKS, NAV_LINKS } from "@/lib/links";
import { Logo } from "./Logo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/5 bg-white/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-emerald-50 text-emerald-900"
                    : "text-emerald-900/70 hover:bg-emerald-50 hover:text-emerald-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={LINKS.yaqiin}
            className="hidden items-center gap-1 rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 sm:inline-flex"
          >
            يقين للمساجد
            <ArrowUpLeft className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-emerald-900 transition hover:bg-emerald-50 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="container mx-auto flex flex-col gap-1 px-4 pb-4 md:hidden">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block rounded-xl px-4 py-3 font-medium transition hover:bg-emerald-50 ${
                  isActive(link.href) ? "bg-emerald-50 text-emerald-900" : "text-emerald-900/80"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={LINKS.yaqiin} className="block rounded-xl px-4 py-3 font-medium text-emerald-700 hover:bg-emerald-50">
              يقين للمساجد ←
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
