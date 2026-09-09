"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { framePath } from "@/lib/framePath";
import { useLocale } from "@/lib/i18n-context";

export function RisksSection() {
  const { t } = useLocale();

  return (
    <section className="bg-surface py-[clamp(5rem,12vh,9rem)]">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[24px] bg-surface-alt">
            <Image
              src={framePath(120)}
              alt=""
              fill
              sizes="(max-width: 1180px) 100vw, 1180px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">{t.risks.eyebrow}</p>
            <h2 className="headline mt-4 text-[clamp(2rem,4.6vw,3.2rem)]">
              {t.risks.title}
            </h2>
          </Reveal>
          <Reveal delay={110} className="space-y-5">
            <p className="text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-ink-soft">
              {t.risks.body}
            </p>
            <p className="text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-ink-soft">
              {t.risks.body2}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
