"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n-context";
import { framePath } from "@/lib/framePath";
import { FRAME_ASPECT } from "@/lib/frames";
import { useReveal } from "@/lib/useReveal";

/** Hotspot positions are calibrated against this exact frame. */
const STILL = framePath(200);

export function OverviewSection() {
  const { t } = useLocale();
  const { ref, revealed } = useReveal<HTMLDivElement>(0.35);
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="overview" className="bg-surface py-[clamp(5rem,12vh,9rem)]">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal className="max-w-[42rem]">
          <p className="eyebrow">{t.overview.eyebrow}</p>
          <h2 className="headline mt-4 text-[clamp(2rem,5vw,3.6rem)]">
            {t.overview.title}
          </h2>
          <p className="mt-4 text-[clamp(1rem,1.7vw,1.22rem)] leading-relaxed text-ink-soft">
            {t.overview.body}
          </p>
        </Reveal>

        <div
          ref={ref}
          className="relative mt-10 w-full overflow-hidden rounded-[24px] bg-surface-alt"
          style={{ aspectRatio: FRAME_ASPECT }}
        >
          <Image
            src={STILL}
            alt=""
            fill
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover"
          />

          {t.overview.hotspots.map((spot, index) => {
            const isActive = active === spot.id;
            // Labels near the right edge open leftwards so they stay in frame.
            const flip = spot.x > 62;
            return (
              <div
                key={spot.id}
                className="absolute"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  opacity: revealed ? 1 : 0,
                  transform: `scale(${revealed ? 1 : 0.7})`,
                  transition: `opacity .6s var(--ease-out-soft) ${index * 160 + 200}ms, transform .6s var(--ease-out-soft) ${index * 160 + 200}ms`,
                }}
              >
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-label={spot.title}
                  onClick={() => setActive(isActive ? null : spot.id)}
                  onMouseEnter={() => setActive(spot.id)}
                  onMouseLeave={() => setActive(null)}
                  className="relative -ml-3 -mt-3 grid h-6 w-6 place-items-center rounded-full bg-surface/95 shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-110"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-accent animate-[pulse-ring_2.6s_var(--ease-out-soft)_infinite]"
                    style={{ animationDelay: `${index * 500}ms` }}
                  />
                  <span
                    aria-hidden
                    className={`relative block h-2 w-2 rounded-full bg-accent-deep transition-transform duration-300 ${
                      isActive ? "scale-125" : ""
                    }`}
                  />
                </button>

                <div
                  className={`pointer-events-none absolute top-1/2 w-[min(56vw,240px)] -translate-y-1/2 rounded-2xl bg-surface/92 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-400 ${
                    flip ? "right-6 text-right" : "left-6"
                  } ${isActive ? "opacity-100" : "translate-y-[calc(-50%+6px)] opacity-0"}`}
                >
                  <p className="text-[14px] font-semibold tracking-[-0.01em]">
                    {spot.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-soft">
                    {spot.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Same content, stacked — the only way this reads on a phone. */}
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-3 md:hidden">
          {t.overview.hotspots.map((spot) => (
            <li key={spot.id} className="bg-surface p-5">
              <p className="text-[15px] font-semibold tracking-[-0.01em]">
                {spot.title}
              </p>
              <p className="mt-1 text-[14px] leading-snug text-ink-soft">
                {spot.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
