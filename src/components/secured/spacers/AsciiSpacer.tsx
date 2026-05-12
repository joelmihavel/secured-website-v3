"use client";

import { useRef, useEffect } from "react";

interface AsciiSpacerConfig {
  chars: string;
  cell: number;
  fps: number;
  wave: (nx: number, ny: number, time: number) => number;
  threshold: number;
  maxAlpha: number;
}

function AsciiSpacerBase({ config, className = "" }: { config: AsciiSpacerConfig; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { chars, cell, fps, wave, threshold, maxAlpha } = config;
    let cols = 0;
    let rows = 0;

    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      cols = Math.ceil(rect.width / cell) + 1;
      rows = Math.ceil(rect.height / cell) + 1;
    }

    resize();
    window.addEventListener("resize", resize);

    let lastFrame = 0;
    const interval = 1000 / fps;

    function render(t: number) {
      animRef.current = requestAnimationFrame(render);
      if (!visibleRef.current) return;
      if (t - lastFrame < interval) return;
      lastFrame = t;

      const time = t * 0.001;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas!.getBoundingClientRect();

      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);
      ctx!.fillStyle = "#131313";
      ctx!.fillRect(0, 0, rect.width, rect.height);
      ctx!.font = `${cell - 2}px monospace`;
      ctx!.textBaseline = "top";

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const nx = col / cols;
          const ny = row / rows;
          const intensity = wave(nx, ny, time);
          if (intensity < threshold) continue;

          const noise = Math.sin(col * 12.9898 + row * 78.233 + time * 2.0) * 43758.5453;
          const frac = noise - Math.floor(noise);
          const charIdx = Math.floor(frac * chars.length);
          const alpha = Math.min(intensity * maxAlpha, 0.55);

          ctx!.fillStyle = `rgba(255, 154, 109, ${alpha})`;
          ctx!.fillText(chars[charIdx], col * cell, row * cell);
        }
      }
    }
    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [config]);

  return (
    <div className={`relative h-[40px] md:h-[60px] lg:h-[140px] overflow-hidden bg-[#131313] ${className}`}>
      <div className="absolute inset-0 lg:left-[120px] lg:right-[120px]">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </div>
  );
}

const BLOCK_CHARS = "░▒▓█▄▀■□";
const blockConfig: AsciiSpacerConfig = {
  chars: BLOCK_CHARS,
  cell: 14,
  fps: 10,
  threshold: 0.15,
  maxAlpha: 0.7,
  wave: (nx, ny, time) => {
    const w = Math.sin(nx * 8 + time * 1.5) * Math.cos(ny * 6 - time * 0.7);
    const noise = Math.sin(nx * 129.898 + ny * 782.33 + time * 2.0) * 43758.5453;
    return (w * 0.5 + 0.5) * (noise - Math.floor(noise));
  },
};

const LINE_CHARS = "─│┼╬═║╪┤├┬┴╫";
const lineConfig: AsciiSpacerConfig = {
  chars: LINE_CHARS,
  cell: 16,
  fps: 8,
  threshold: 0.2,
  maxAlpha: 0.6,
  wave: (nx, ny, time) => {
    const horizontal = Math.sin(ny * 12 + time * 0.6) * 0.5 + 0.5;
    const drift = Math.sin(nx * 4 - time * 0.3) * 0.3;
    const noise = Math.sin(nx * 45.233 + ny * 91.117 + time * 1.2) * 43758.5453;
    return horizontal * (0.5 + drift) * (noise - Math.floor(noise));
  },
};

const DOT_CHARS = "·•●○◦◎⊙⊚∘";
const dotConfig: AsciiSpacerConfig = {
  chars: DOT_CHARS,
  cell: 12,
  fps: 8,
  threshold: 0.12,
  maxAlpha: 0.65,
  wave: (nx, ny, time) => {
    const ripple = Math.sin(Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2) * 20 - time * 2) * 0.5 + 0.5;
    const noise = Math.sin(nx * 67.456 + ny * 34.789 + time * 1.5) * 43758.5453;
    return ripple * (noise - Math.floor(noise));
  },
};

const GLYPH_CHARS = "◆◇△▽⬡⬢⏣⎔⟐⟡";
const glyphConfig: AsciiSpacerConfig = {
  chars: GLYPH_CHARS,
  cell: 18,
  fps: 6,
  threshold: 0.18,
  maxAlpha: 0.5,
  wave: (nx, ny, time) => {
    const diag = Math.sin((nx + ny) * 10 + time * 0.8) * 0.5 + 0.5;
    const pulse = Math.sin(time * 0.5) * 0.2 + 0.8;
    const noise = Math.sin(nx * 23.456 + ny * 56.789 + time * 0.9) * 43758.5453;
    return diag * pulse * (noise - Math.floor(noise));
  },
};

export function AsciiBlockSpacer({ className = "" }: { className?: string }) {
  return <AsciiSpacerBase config={blockConfig} className={className} />;
}

export function AsciiLineSpacer({ className = "" }: { className?: string }) {
  return <AsciiSpacerBase config={lineConfig} className={className} />;
}

export function AsciiDotSpacer({ className = "" }: { className?: string }) {
  return <AsciiSpacerBase config={dotConfig} className={className} />;
}

export function AsciiGlyphSpacer({ className = "" }: { className?: string }) {
  return <AsciiSpacerBase config={glyphConfig} className={className} />;
}
