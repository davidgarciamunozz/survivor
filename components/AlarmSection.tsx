"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/i18n-context";

export function AlarmSection() {
  const { t } = useLocale();
  const [armed, setArmed] = useState(false);

  return (
    <section
      id="alarm"
      className="relative overflow-hidden py-[clamp(6rem,14vh,10rem)] transition-colors duration-700"
      style={{ background: armed ? "var(--color-accent)" : "var(--color-ink)" }}
    >
      {/* Expanding wash of light when the switch is flipped. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[140vmax] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[opacity,transform] duration-[1200ms] ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.34) 0%, transparent 62%)",
          opacity: armed ? 1 : 0,
          transform: `translate(-50%,-50%) scale(${armed ? 1 : 0.35})`,
        }}
      />

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 px-6 sm:px-8 md:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <p
            className="eyebrow transition-colors duration-700"
            style={{ color: armed ? "var(--color-ink)" : "var(--color-accent)" }}
          >
            {t.alarm.eyebrow}
          </p>
          <h2
            className="headline mt-4 text-[clamp(2.4rem,6vw,4.2rem)] transition-colors duration-700"
            style={{ color: armed ? "var(--color-ink)" : "#ffffff" }}
          >
            {t.alarm.title}
          </h2>
          <p
            className="mt-5 max-w-[46ch] text-[clamp(1rem,1.8vw,1.28rem)] leading-relaxed transition-colors duration-700"
            style={{
              color: armed ? "rgba(29,29,31,0.78)" : "rgba(255,255,255,0.68)",
            }}
          >
            {t.alarm.body}
          </p>
          <p
            className="mt-4 text-[14px] transition-colors duration-700"
            style={{
              color: armed ? "rgba(29,29,31,0.6)" : "rgba(255,255,255,0.45)",
            }}
          >
            {t.alarm.detail}
          </p>
        </Reveal>

        <Reveal delay={140} className="justify-self-center">
          <div className="flex flex-col items-center gap-5">
            {/* Recessed housing, as on the case's left edge. */}
            <button
              type="button"
              role="switch"
              aria-checked={armed}
              aria-label={t.alarm.title}
              onClick={() => setArmed((value) => !value)}
              className="group relative grid h-[188px] w-[104px] place-items-start rounded-[52px] bg-[#111113] p-3 shadow-[inset_0_2px_14px_rgba(0,0,0,0.9),0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 active:scale-[0.98]"
            >
              <span
                className="grid h-[80px] w-[80px] place-items-center rounded-full transition-[transform,background-color,box-shadow] duration-500"
                style={{
                  transform: `translateY(${armed ? 84 : 0}px)`,
                  backgroundColor: armed ? "var(--color-alarm)" : "#3a3a3d",
                  boxShadow: armed
                    ? "0 0 0 6px rgba(229,72,77,0.28), 0 0 44px rgba(229,72,77,0.75)"
                    : "inset 0 -3px 8px rgba(0,0,0,0.6)",
                }}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full transition-colors duration-500"
                  style={{
                    backgroundColor: armed
                      ? "rgba(255,255,255,0.92)"
                      : "rgba(255,255,255,0.14)",
                  }}
                />
              </span>
            </button>

            <p
              className="text-[13px] font-semibold uppercase tracking-[0.16em] transition-colors duration-500"
              style={{
                color: armed
                  ? "var(--color-ink)"
                  : "rgba(255,255,255,0.55)",
              }}
              aria-live="polite"
            >
              {armed ? t.alarm.state.active : t.alarm.state.idle}
            </p>
            {!armed && (
              <p className="text-[12px] text-white/35">{t.alarm.hint}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
