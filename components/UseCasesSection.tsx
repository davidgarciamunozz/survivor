"use client";

import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n-context";

type Scene = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  alt: string;
};

/**
 * The scenes exist in two crops — a 2.33:1 wide frame and a 4:5 portrait one,
 * cut to each photograph's focal point by scripts/optimize-scenes.mjs. A plain
 * <picture> is used rather than next/image because this is art direction, not
 * just resizing: the two crops are different photographs as far as the layout
 * is concerned, and <source media> guarantees the browser downloads exactly
 * one of them. next/image would ship both and hide one with CSS.
 */
function SceneFrame({ id, alt }: { id: string; alt: string }) {
  const set = (variant: string, ext: string, widths: number[]) =>
    widths.map((w) => `/scenes/${id}-${variant}-${w}.${ext} ${w}w`).join(", ");

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-night sm:aspect-[1916/821]">
      <picture>
        <source
          media="(min-width: 640px)"
          type="image/avif"
          srcSet={set("wide", "avif", [1280, 1920])}
          sizes="(max-width: 1180px) 100vw, 1180px"
        />
        <source
          media="(min-width: 640px)"
          type="image/webp"
          srcSet={set("wide", "webp", [1280, 1920])}
          sizes="(max-width: 1180px) 100vw, 1180px"
        />
        <source
          type="image/avif"
          srcSet={set("portrait", "avif", [640, 900])}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={set("portrait", "webp", [640, 900])}
          sizes="100vw"
        />
        <img
          src={`/scenes/${id}-portrait-900.webp`}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
    </div>
  );
}

function SceneBlock({ scene, index }: { scene: Scene; index: number }) {
  return (
    <article>
      <Reveal>
        <SceneFrame id={scene.id} alt={scene.alt} />
      </Reveal>

      {/* Copy sits under the photograph on the chapter's own background, never
          over it — every scene puts its light in a different place, so there
          is no one safe corner for text across all four. */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="eyebrow-night flex items-baseline gap-3">
            <span className="tabular-nums text-night-soft">0{index + 1}</span>
            {scene.eyebrow}
          </p>
          <h3 className="headline mt-4 max-w-[20ch] text-[clamp(1.6rem,3.4vw,2.4rem)] text-night-ink">
            {scene.title}
          </h3>
        </Reveal>
        <Reveal delay={110}>
          <p className="text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-night-soft md:mt-10">
            {scene.body}
          </p>
        </Reveal>
      </div>
    </article>
  );
}

/**
 * The problem chapter. It runs between ProblemSection and the product film so
 * the situations land before the case is ever shown, and it is deliberately
 * the only dark stretch of the page: the problem happens in the dark, the
 * product lives in the light.
 */
export function UseCasesSection() {
  const { t } = useLocale();

  return (
    <section
      id="cases"
      className="bg-night py-[clamp(5rem,12vh,9rem)] text-night-ink"
    >
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal>
          <p className="eyebrow-night">{t.cases.eyebrow}</p>
          <h2 className="headline mt-4 max-w-[20ch] text-[clamp(2rem,5vw,3.6rem)]">
            {t.cases.title}
          </h2>
          <p className="mt-6 max-w-[46ch] text-[clamp(1rem,1.7vw,1.22rem)] leading-relaxed text-night-soft">
            {t.cases.lead}
          </p>
        </Reveal>

        <div className="mt-16 space-y-[clamp(4rem,9vh,7rem)]">
          {t.cases.scenes.map((scene, index) => (
            <SceneBlock key={scene.id} scene={scene} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
