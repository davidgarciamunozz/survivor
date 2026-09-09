"use client";

import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n-context";

export function ProblemSection() {
  const { t } = useLocale();

  return (
    <section className="bg-surface-alt py-[clamp(5rem,12vh,9rem)]">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal>
          <p className="eyebrow">{t.problem.eyebrow}</p>
          <h2 className="headline mt-4 max-w-[18ch] text-[clamp(2rem,5vw,3.6rem)]">
            {t.problem.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <ul className="space-y-8">
            {t.problem.points.map((point, index) => (
              <Reveal key={index} delay={index * 90}>
                <li className="flex gap-5 border-t border-hairline pt-6">
                  <span className="mt-1 text-[13px] font-semibold tabular-nums text-accent-deep">
                    0{index + 1}
                  </span>
                  <p className="text-[clamp(1rem,1.7vw,1.22rem)] leading-relaxed text-ink-soft">
                    {point}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={180}>
            <figure className="rounded-[22px] bg-surface p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <figcaption className="eyebrow">
                {t.problem.insightLabel}
              </figcaption>
              <blockquote className="mt-4 text-[clamp(1.1rem,2vw,1.5rem)] leading-snug tracking-[-0.015em]">
                {t.problem.insight}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
