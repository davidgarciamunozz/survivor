"use client";

import { useLocale } from "@/lib/i18n-context";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-hairline bg-surface py-12">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {t.footer.presentedBy}
        </p>
        <p className="mt-3 max-w-[70ch] text-[13px] leading-relaxed text-ink-soft">
          {t.footer.team}
        </p>
        <p className="mt-6 text-[12px] text-ink-faint">{t.footer.note}</p>
      </div>
    </footer>
  );
}
