import Link from "next/link";
import { LINKS, NAV_LINKS, SOCIAL_LINKS } from "@/lib/links";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-emerald-900/5 bg-emerald-50/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-emerald-900/60">
            جزء من منظومة يقين لخدمة المجتمع الإسلامي.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-emerald-950">يقين للمعرفة</h2>
          <ul className="mt-4 space-y-2 text-sm text-emerald-900/60">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-emerald-800">{link.label}</Link>
              </li>
            ))}
            <li><a href={LINKS.quran} className="transition hover:text-emerald-800">القرآن الكريم</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-emerald-950">تواصل معنا</h2>
          <ul className="mt-4 space-y-2 text-sm text-emerald-900/60">
            <li><a href={LINKS.yaqiin} className="transition hover:text-emerald-800">يقين للمساجد</a></li>
            <li><a href={LINKS.contact} className="transition hover:text-emerald-800">contact@yaqiin.org</a></li>
          </ul>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-emerald-900/60">
            {SOCIAL_LINKS.map(link => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-emerald-800">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-emerald-900/5 py-6 text-center text-sm text-emerald-900/50">
        جميع الحقوق محفوظة © {new Date().getFullYear()} يقين
      </p>
    </footer>
  );
}
