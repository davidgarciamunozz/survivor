"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n-context";

export function NavBar() {
  const { t, toggleLocale } = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-hairline/60 bg-surface/72 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-12 max-w-[1180px] items-center gap-6 px-5 sm:h-14 sm:px-8">
        <a
          href="#top"
          className="text-[17px] font-semibold tracking-[-0.01em] text-ink"
        >
          {t.nav.product}
        </a>

        <ul className="ml-auto hidden items-center gap-8 md:flex">
          {t.nav.links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="text-[12px] text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.localeSwitchLabel}
            className="rounded-full border border-hairline px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            {t.localeName}
          </button>
          <a
            href="#closing"
            className="rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-medium text-ink transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          >
            {t.nav.cta}
          </a>
        </div>
      </nav>
    </header>
  );
}
