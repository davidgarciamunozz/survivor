"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger for siblings revealing at once. */
  delay?: number;
};

/** Wraps content in the shared fade-and-rise reveal. */
export function Reveal({ children, className = "", delay = 0 }: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${revealed ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
