"use client";

import { useEffect, useRef } from "react";

export function SecuredAsciiBanner({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w === 0 || h === 0) return;

    canvas.width = w;
    canvas.height = h;

    async function init() {
      await document.fonts.ready;

      const srcW = 1440;
      const srcH = 400;
      const offscreen = document.createElement("canvas");
      offscreen.width = srcW;
      offscreen.height = srcH;
      const octx = offscreen.getContext("2d");
      if (!octx) return;

      octx.fillStyle = "#000";
      octx.fillRect(0, 0, srcW, srcH);
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = `900 ${srcH * 0.55}px "Plus Jakarta Sans", "Inter", "Helvetica Neue", sans-serif`;
      octx.fillText("SECURED", srcW / 2, srcH / 2);

      const dataUrl = offscreen.toDataURL("image/png");

      const { createAsciiRenderer } = await import("landing-effects");
      cleanupRef.current = createAsciiRenderer({
        canvas: canvas!,
        imageSrc: dataUrl,
        fontSize: 9,
        fontFamily: "monospace",
        chars: " 0123456789",
        brightnessBoost: 2.2,
        parallaxStrength: 6,
        scale: 1.15,
        posterize: 32,
      });
    }

    init();

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        filter: "hue-rotate(175deg) saturate(1.8) brightness(0.5) contrast(1.2)",
      }}
    />
  );
}
