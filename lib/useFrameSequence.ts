"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { framePath, type FrameSize } from "./framePath";
import { FRAME_COUNT } from "./frames";

const PRELOAD_CONCURRENCY = 6;
/** Enough frames buffered before we let the canvas be considered ready. */
const READY_THRESHOLD = 0.25;
/** On portrait screens, how much of the frame's width fills the canvas. */
const PORTRAIT_FRAME_FILL = 0.58;
/** Where the render's centre sits vertically on portrait screens. */
const PORTRAIT_ANCHOR = 0.36;

function pickSize(): FrameSize {
  if (typeof window === "undefined") return "hd";
  const narrow = window.matchMedia("(max-width: 820px)").matches;
  // navigator.connection is Chromium-only; absence just means "assume fast".
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return narrow || connection?.saveData ? "sm" : "hd";
}

type FrameSequence = {
  /** Attach to the <canvas>. */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Draw the frame at `progress` (0–1). Safe to call every scroll tick. */
  draw: (progress: number) => void;
  /** 0–1, how much of the sequence has downloaded. */
  loaded: number;
  ready: boolean;
};

export function useFrameSequence(): FrameSequence {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const pendingRef = useRef<number | null>(null);
  const drawnRef = useRef(-1);
  const rafRef = useRef(0);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  const paint = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const image = framesRef.current[index];
    if (!canvas || !image?.complete || image.naturalWidth === 0) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    // The frame is still upscaled on a Retina display, so pay for the better
    // resampling kernel — it is the difference between soft and crisp edges.
    context.imageSmoothingQuality = "high";

    const { width, height } = canvas;
    const portrait = width / height < 1;

    // Landscape: fill the viewport. Portrait: cover would crop the product
    // down to a sliver, so instead show ~58% of the frame's width and sit the
    // render high, leaving the lower third for the copy.
    const scale = portrait
      ? width / (image.naturalWidth * PORTRAIT_FRAME_FILL)
      : Math.max(width / image.naturalWidth, height / image.naturalHeight);

    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    const y = portrait ? height * PORTRAIT_ANCHOR - h / 2 : (height - h) / 2;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, (width - w) / 2, y, w, h);

    // On portrait the render sits in a band, so dissolve its top and bottom
    // edges into the page rather than leaving two hard grey lines.
    if (portrait) {
      const fade = h * 0.14;
      const top = context.createLinearGradient(0, y, 0, y + fade);
      top.addColorStop(0, "rgba(255,255,255,1)");
      top.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = top;
      context.fillRect(0, y, width, fade);

      const bottom = context.createLinearGradient(0, y + h, 0, y + h - fade);
      bottom.addColorStop(0, "rgba(255,255,255,1)");
      bottom.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = bottom;
      context.fillRect(0, y + h - fade, width, fade);
    }

    drawnRef.current = index;
  }, []);

  // Resize the backing store to the element's box, capped at 2x DPR.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      if (drawnRef.current >= 0) paint(drawnRef.current);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paint]);

  // Preload every frame, first one first, then a bounded-concurrency sweep.
  useEffect(() => {
    const size = pickSize();
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    framesRef.current = images;

    let cancelled = false;
    let done = 0;
    let cursor = 0;

    const load = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.decoding = "async";
        image.src = framePath(index, size);
        images[index] = image;

        const finish = () => {
          if (cancelled) return resolve();
          done += 1;
          setLoaded(done / FRAME_COUNT);
          if (done === 1) {
            // First frame available — show something immediately.
            paint(pendingRef.current ?? 0);
          }
          if (done / FRAME_COUNT >= READY_THRESHOLD) setReady(true);
          // A frame we were waiting on just arrived.
          if (pendingRef.current !== null && images[pendingRef.current] === image) {
            paint(pendingRef.current);
          }
          resolve();
        };

        image.onload = finish;
        image.onerror = finish;
      });

    const worker = async () => {
      while (!cancelled && cursor < FRAME_COUNT) {
        const index = cursor;
        cursor += 1;
        await load(index);
      }
    };

    const workers = Array.from(
      { length: Math.min(PRELOAD_CONCURRENCY, FRAME_COUNT) },
      worker,
    );
    void Promise.all(workers);

    return () => {
      cancelled = true;
      for (const image of images) if (image) image.src = "";
    };
  }, [paint]);

  const draw = useCallback(
    (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      const index = Math.min(
        FRAME_COUNT - 1,
        Math.round(clamped * (FRAME_COUNT - 1)),
      );
      pendingRef.current = index;
      if (index === drawnRef.current) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const target = pendingRef.current;
        if (target === null) return;
        // Fall back to the nearest decoded frame so scrubbing never stalls.
        const image = framesRef.current[target];
        if (image?.complete && image.naturalWidth > 0) {
          paint(target);
        }
      });
    },
    [paint],
  );

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { canvasRef, draw, loaded, ready };
}
