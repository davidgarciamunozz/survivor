"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Progress (0–1) of a tall element scrolling past a sticky viewport.
 * 0 = the element's top just reached the top of the viewport,
 * 1 = its bottom is about to leave.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress?: (progress: number) => void,
) {
  const [progress, setProgress] = useState(0);
  const callbackRef = useRef(onProgress);
  callbackRef.current = onProgress;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const next =
        scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable));
      setProgress(next);
      callbackRef.current?.(next);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);

  return progress;
}
