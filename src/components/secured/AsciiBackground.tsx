"use client";

import { useEffect, useRef } from "react";

interface AsciiBackgroundProps {
  imageSrc: string;
  className?: string;
  fontSize?: number;
  chars?: string;
  brightnessBoost?: number;
  parallaxStrength?: number;
  scale?: number;
  posterize?: number;
}

export function AsciiBackground({
  imageSrc,
  className = "",
  fontSize = 10,
  chars,
  brightnessBoost = 1.1,
  parallaxStrength = 0.3,
  scale = 1,
  posterize,
}: AsciiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    if (canvas.width === 0 || canvas.height === 0) return;

    import("landing-effects").then(({ createAsciiRenderer }) => {
      cleanupRef.current = createAsciiRenderer({
        canvas,
        imageSrc,
        fontSize,
        fontFamily: "monospace",
        chars,
        brightnessBoost,
        parallaxStrength,
        scale,
        posterize,
      });
    });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        filter: "grayscale(1) brightness(0.7) contrast(1.1)",
      }}
    />
  );
}
