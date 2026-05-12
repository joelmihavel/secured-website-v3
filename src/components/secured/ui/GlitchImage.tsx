"use client";

import { useRef, useEffect, useCallback } from "react";

const GLITCH_INTERVAL = 50;

export function GlitchImage({ src, alt = "" }: { src: string; alt?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<number>(0);
  const lastGlitchRef = useRef<number>(0);
  const inViewRef = useRef(false);

  const render = useCallback((time: number) => {
    if (!inViewRef.current) {
      frameRef.current = 0;
      return;
    }
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Draw top half of source image (head + torso), preserving aspect ratio
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight * 0.55;
    ctx.filter = "saturate(0.08) brightness(0.315) contrast(1.2) sepia(0.9) blur(0.5px)";
    ctx.drawImage(img, 0, 0, srcW, srcH, 0, 0, w, h);
    ctx.filter = "none";

    // Orange tint overlay
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = "rgba(255, 154, 109, 0.2)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "color";
    ctx.fillStyle = "rgba(255, 140, 90, 0.5)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";

    // Chromatic aberration
    pfxChromatic(ctx, w, h, 4);

    // Glitch — throttled
    if (time - lastGlitchRef.current > GLITCH_INTERVAL) {
      pfxGlitch(ctx, w, h, 0.25);
      lastGlitchRef.current = time;
    }

    // Scanlines
    pfxScanLines(ctx, w, h, 0.35, 3);

    // Film grain
    pfxFilmGrain(ctx, w, h, 0.4);

    // Vignette
    pfxVignette(ctx, w, h, 0.85);

    frameRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Canvas matches the cropped region's aspect ratio (top 55% of image)
      const cropAspect = img.naturalWidth / (img.naturalHeight * 0.55);
      canvas.width = Math.min(img.naturalWidth, 1500);
      canvas.height = Math.round(canvas.width / cropAspect);
      if (inViewRef.current && !frameRef.current) {
        frameRef.current = requestAnimationFrame(render);
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [src, render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (imgRef.current && !frameRef.current) {
            frameRef.current = requestAnimationFrame(render);
          }
        } else {
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
          }
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [render]);

  return (
    <div aria-hidden="true" style={{ width: "100%", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}

function pfxChromatic(ctx: CanvasRenderingContext2D, w: number, h: number, offset: number) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const src = new Uint8ClampedArray(imgData.data);
  const d = imgData.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const rIdx = (y * w + Math.max(0, x - offset)) * 4;
      const bIdx = (y * w + Math.min(w - 1, x + offset)) * 4 + 2;
      d[i] = src[rIdx];
      d[i + 1] = src[i + 1];
      d[i + 2] = src[bIdx];
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function pfxGlitch(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) {
  const sliceCount = Math.floor(3 + intensity * 15);
  const maxOffset = Math.floor(intensity * w * 0.1);
  for (let i = 0; i < sliceCount; i++) {
    const sliceY = Math.floor(Math.random() * h);
    const sliceH = Math.floor(2 + Math.random() * 20);
    const offset = Math.floor((Math.random() - 0.5) * 2 * maxOffset);
    if (!offset) continue;
    const safeH = Math.min(sliceH, h - sliceY);
    if (safeH <= 0) continue;
    const slice = ctx.getImageData(0, sliceY, w, safeH);
    ctx.putImageData(slice, offset, sliceY);
  }
}

function pfxScanLines(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number, spacing: number) {
  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${intensity * 0.6})`;
  for (let y = 0; y < h; y += spacing) {
    ctx.fillRect(0, y, w, 1);
  }
  ctx.restore();
}

function pfxFilmGrain(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  const strength = intensity * 50;
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * strength;
    d[i] += noise;
    d[i + 1] += noise;
    d[i + 2] += noise;
  }
  ctx.putImageData(imgData, 0, 0);
}

function pfxVignette(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.max(w, h) * 0.65;
  const gradient = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.6, `rgba(19, 19, 19, ${intensity * 0.5})`);
  gradient.addColorStop(1, `rgba(19, 19, 19, ${intensity})`);
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
