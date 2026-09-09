"use client";

import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n-context";

export function ClosingSection() {
  const { t } = useLocale();

  return (
    <section
      id="closing"
      className="bg-surface-alt py-[clamp(6rem,16vh,11rem)] text-center"
    >
      <Reveal className="mx-auto max-w-[720px] px-6">
        <h2 className="headline text-[clamp(2.2rem,5.6vw,4rem)]">
          {t.closing.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[46ch] text-[clamp(1rem,1.8vw,1.25rem)] leading-relaxed text-ink-soft">
          {t.closing.body}
        </p>
        <a
          href="#top"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-2.5 text-[15px] font-medium text-ink transition-transform duration-300 hover:scale-[1.03] active:scale-95"
        >
          {t.closing.cta}
        </a>
      </Reveal>
    </section>
  );
}
