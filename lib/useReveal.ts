"use client";

import { useEffect, useRef, useState } from "react";

/** Flips to true the first time the element is meaningfully on screen. */
export function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed, threshold]);

  return { ref, revealed };
}
