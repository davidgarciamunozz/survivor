"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n-context";
import { useFrameSequence } from "@/lib/useFrameSequence";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useScrollProgress } from "@/lib/useScrollProgress";

/** Each copy block gets a full viewport of scroll, plus lead-in and lead-out. */
const VIEWPORTS_PER_BLOCK = 1.35;
/** Fraction of a block's window spent fading in and out. */
const FADE = 0.22;

export function ScrollStage() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { canvasRef, draw, loaded, ready } = useFrameSequence();
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useScrollProgress(sectionRef, (value) => {
    setProgress(value);
    // With reduced motion the film stops scrubbing and becomes one still per
    // copy block, so the section reads as a slideshow rather than animation.
    draw(reducedMotion ? stillFor(value, t.stage.length) : value);
  });

  const height = useMemo(
    () => `${Math.round(t.stage.length * VIEWPORTS_PER_BLOCK * 100) + 100}svh`,
    [t.stage.length],
  );

  return (
    <section id="film" ref={sectionRef} style={{ height }} className="relative bg-surface">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-label={t.a11y.filmLabel}
          role="img"
          className="absolute inset-0 h-full w-full"
        />

        {/* Scrims that keep the type readable wherever the render sits:
            bottom on phones, left column on wider screens. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-white via-white/85 to-transparent md:hidden"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-white via-white/72 to-transparent md:block"
        />

        {t.stage.map((block, index) => {
          const opacity = blockOpacity(progress, block.at, block.until);
          return (
            <div
              key={index}
              aria-hidden={opacity < 0.05}
              style={{
                opacity,
                transform: `translateY(${(1 - opacity) * 18}px)`,
              }}
              className="pointer-events-none absolute inset-x-0 bottom-[8svh] px-6 will-change-[opacity,transform] md:bottom-auto md:top-1/2 md:left-[6vw] md:max-w-[30rem] md:-translate-y-1/2 md:px-0"
            >
              <p className="eyebrow">{block.eyebrow}</p>
              <h2 className="headline mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)]">
                {block.title}
              </h2>
              <p className="mt-4 max-w-[40ch] text-[clamp(0.98rem,1.5vw,1.15rem)] leading-relaxed text-ink-soft">
                {block.body}
              </p>
            </div>
          );
        })}

        {/* Preload indicator — disappears for good once enough frames land. */}
        <div
          className={`absolute inset-x-0 top-0 h-[2px] bg-hairline/50 transition-opacity duration-700 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          role="progressbar"
          aria-label={t.a11y.loading}
          aria-valuenow={Math.round(loaded * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${loaded * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}

/** Snaps to the middle of whichever block is active. */
function stillFor(progress: number, blocks: number) {
  const index = Math.min(blocks - 1, Math.floor(progress * blocks));
  return (index + 0.5) / blocks;
}

/** Ramps 0 → 1 → 0 across the block's slice of the scroll. */
function blockOpacity(progress: number, at: number, until: number) {
  if (progress < at || progress > until) return 0;
  const span = until - at;
  const local = (progress - at) / span;
  if (local < FADE) return local / FADE;
  if (local > 1 - FADE) return (1 - local) / FADE;
  return 1;
}
