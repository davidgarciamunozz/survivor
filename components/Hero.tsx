"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { framePath } from "@/lib/framePath";
import { useLocale } from "@/lib/i18n-context";
import { useMediaQuery } from "@/lib/useMediaQuery";

// three.js and the model are a separate chunk, fetched only for the screens
// that actually render the 3D hero.
const HeroModel = dynamic(() => import("@/components/HeroModel"), {
  ssr: false,
});

// The 3D hero starts at 820px. Every `min-[820px]:` class below has to be
// written out in full — Tailwind scans source text, so a class assembled from
// a variable is never generated.
const WIDE_QUERY = "(min-width: 820px)";

export function Hero() {
  const { t } = useLocale();
  // Phones keep the still: the 3D chunk and its battery cost are not worth it
  // on the weakest devices.
  const canRender3D = useMediaQuery(WIDE_QUERY);
  const [modelReady, setModelReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const [touched, setTouched] = useState(false);

  const onReady = useCallback(() => setModelReady(true), []);
  const onFail = useCallback(() => setModelFailed(true), []);

  // The still is the hero on phones, and a rescue on desktop only once the
  // model has actually failed — never a placeholder during loading, which
  // would flash on every reload.
  const showStill = !canRender3D || modelFailed;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-surface"
    >
      {canRender3D && !modelFailed && (
        <div
          className="absolute inset-0 z-0 transition-opacity duration-700"
          style={{ opacity: modelReady ? 1 : 0 }}
          onPointerDown={() => setTouched(true)}
        >
          <HeroModel
            onReady={onReady}
            onFail={onFail}
            label={t.a11y.modelLabel}
          />
        </div>
      )}

      {/* Centred above the still on phones; anchored bottom-left over the
          model on wide screens. */}
      <div className="pointer-events-none relative z-10 mx-auto max-w-[720px] px-6 pt-20 text-center sm:pt-24 min-[820px]:absolute min-[820px]:bottom-[7vh] min-[820px]:left-[5vw] min-[820px]:mx-0 min-[820px]:max-w-[min(38vw,30rem)] min-[820px]:px-0 min-[820px]:pt-0 min-[820px]:text-left">
        <p className="eyebrow animate-[fade-up_0.9s_var(--ease-out-soft)_both]">
          {t.hero.eyebrow}
        </p>
        <h1 className="headline mt-3 text-[clamp(2.2rem,5.4vw,3.9rem)] animate-[fade-up_0.9s_var(--ease-out-soft)_0.08s_both] min-[820px]:text-[clamp(1.9rem,3.3vw,3.1rem)]">
          {t.hero.title}
        </h1>
        <p className="mx-auto mt-4 max-w-[540px] text-[clamp(1rem,1.9vw,1.28rem)] leading-relaxed text-ink-soft animate-[fade-up_0.9s_var(--ease-out-soft)_0.16s_both] min-[820px]:mx-0 min-[820px]:max-w-[36ch] min-[820px]:text-[0.98rem]">
          {t.hero.subtitle}
        </p>

        {/* On wide screens the primary action moves to the opposite corner,
            so only the quiet link stays with the copy. */}
        <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[15px] animate-[fade-up_0.9s_var(--ease-out-soft)_0.24s_both] min-[820px]:mt-5 min-[820px]:justify-start">
          <a
            href="#film"
            className="rounded-full bg-accent px-5 py-2 font-medium text-ink transition-transform duration-300 hover:scale-[1.03] active:scale-95 min-[820px]:hidden"
          >
            {t.hero.primary}
          </a>
          <a
            href="#overview"
            className="font-medium text-accent-deep transition-opacity hover:opacity-70"
          >
            {t.hero.secondary} &rsaquo;
          </a>
        </div>
      </div>

      <a
        href="#film"
        className="absolute bottom-[7vh] right-[5vw] z-10 hidden rounded-full bg-accent px-6 py-2.5 text-[15px] font-medium text-ink transition-transform duration-300 hover:scale-[1.03] active:scale-95 min-[820px]:block"
      >
        {t.hero.primary}
      </a>

      {showStill && (
        <div className="relative z-0 mt-4 min-h-[30svh] w-full flex-1">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-top animate-[fade-in_1.4s_var(--ease-out-soft)_0.2s_both]"
            style={{
              backgroundImage: `url('${framePath(0)}')`,
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 14%, #000 34%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 14%, #000 34%)",
            }}
          />
          {/* Wide screens only reach the still when WebGL is unavailable, and
              there the copy sits over the product — so lift it off. */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-white via-white/80 to-transparent min-[820px]:block"
          />
        </div>
      )}

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-ink-faint transition-opacity duration-500"
        style={{
          opacity: showStill ? 1 : modelReady && !touched ? 1 : 0,
        }}
      >
        {showStill ? t.hero.scrollHint : t.hero.dragHint}
      </span>
    </section>
  );
}
