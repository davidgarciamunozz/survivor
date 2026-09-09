"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroScene } from "@/lib/heroScene";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Props = {
  /** Fires once the first frame is on screen. */
  onReady: () => void;
  /** Fires if WebGL is missing or the model cannot load. */
  onFail: () => void;
  label: string;
};

export default function HeroModel({ onReady, onFail, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: HeroScene | null = null;
    let cancelled = false;

    // three.js only enters the bundle here, and only on screens that get the
    // 3D hero at all.
    void import("@/lib/heroScene")
      .then(({ createHeroScene }) =>
        createHeroScene(canvas, { reducedMotion, onReady }),
      )
      .then((created) => {
        if (cancelled) {
          created.dispose();
          return;
        }
        scene = created;
        sceneRef.current = created;
        created.setActive(true);
      })
      .catch(() => {
        // No WebGL, or the model failed to load: fall back to the still.
        if (!cancelled) onFail();
      });

    return () => {
      cancelled = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [reducedMotion, onReady, onFail]);

  // Render only while the hero is on screen and the tab is in front.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let onScreen = true;
    const sync = () =>
      sceneRef.current?.setActive(onScreen && !document.hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={`h-full w-full touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        sceneRef.current?.setPointer(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          ((event.clientY - rect.top) / rect.height) * 2 - 1,
        );
        sceneRef.current?.drag(event.clientX);
      }}
      onPointerLeave={() => {
        sceneRef.current?.setPointer(0, 0);
        sceneRef.current?.endDrag();
        setDragging(false);
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        sceneRef.current?.startDrag(event.clientX);
        setDragging(true);
      }}
      onPointerUp={(event) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        sceneRef.current?.endDrag();
        setDragging(false);
      }}
    />
  );
}
