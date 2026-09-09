"use client";

import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n-context";

export function PillarsSection() {
  const { t } = useLocale();

  return (
    <section id="power" className="bg-surface-alt py-[clamp(5rem,12vh,9rem)]">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal className="max-w-[46rem]">
          <p className="eyebrow">{t.pillars.eyebrow}</p>
          <h2 className="headline mt-4 text-[clamp(1.9rem,4vw,3rem)]">
            {t.pillars.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.pillars.items.map((item, index) => (
            <Reveal key={item.id} delay={index * 110}>
              <article className="flex h-full flex-col rounded-[24px] bg-surface p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)]">
                <span className="text-[13px] font-semibold tabular-nums text-accent-deep">
                  0{index + 1}
                </span>
                <h3 className="headline mt-6 text-[clamp(1.4rem,2.6vw,1.85rem)]">
                  {item.name}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
