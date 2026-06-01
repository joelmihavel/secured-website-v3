"use client";

import { useEffect, useRef } from "react";

const AMOUNT = 20;
const SINE_DOTS = Math.floor(AMOUNT * 0.3);
const DOT_SIZE = 26;
const IDLE_TIMEOUT = 150;

export function BlobCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<
    {
      el: HTMLSpanElement;
      x: number;
      y: number;
      scale: number;
      range: number;
      limit: number;
      lockX: number;
      lockY: number;
      angleX: number;
      angleY: number;
    }[]
  >([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const idleRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const isTouchOnly =
      typeof window !== "undefined" &&
      !window.matchMedia("(any-pointer: fine)").matches;
    if (isTouchOnly) return;

    const container = containerRef.current;
    if (!container) return;

    // Build dots
    const dots: typeof dotsRef.current = [];
    for (let i = 0; i < AMOUNT; i++) {
      const el = document.createElement("span");
      const scale = 1 - 0.05 * i;
      el.style.cssText = `
        position: absolute;
        display: block;
        width: ${DOT_SIZE}px;
        height: ${DOT_SIZE}px;
        border-radius: 20px;
        background: #FF7832;
        transform-origin: center center;
        transform: translate(-50%, -50%) scale(${scale});
        will-change: transform;
      `;
      container.appendChild(el);
      dots.push({
        el,
        x: 0,
        y: 0,
        scale,
        range: DOT_SIZE / 2 - (DOT_SIZE / 2) * scale + 2,
        limit: DOT_SIZE * 0.75 * scale,
        lockX: 0,
        lockY: 0,
        angleX: Math.PI * 2 * Math.random(),
        angleY: Math.PI * 2 * Math.random(),
      });
    }
    dotsRef.current = dots;

    const goIdle = () => {
      idleRef.current = true;
      for (const dot of dots) {
        dot.lockX = dot.x;
        dot.lockY = dot.y;
        dot.angleX = Math.PI * 2 * Math.random();
        dot.angleY = Math.PI * 2 * Math.random();
      }
    };

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      idleRef.current = false;
      timerRef.current = setTimeout(goIdle, IDLE_TIMEOUT);
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX - DOT_SIZE / 2;
      mouseRef.current.y = e.clientY - DOT_SIZE / 2;
      resetTimer();
    };

    const render = () => {
      let x = mouseRef.current.x;
      let y = mouseRef.current.y;
      const idle = idleRef.current;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const next = dots[i + 1] || dots[0];

        dot.x = x;
        dot.y = y;

        if (!idle || i <= SINE_DOTS) {
          dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${dot.scale})`;
        } else {
          dot.angleX += 0.05;
          dot.angleY += 0.05;
          dot.y = dot.lockY + Math.sin(dot.angleY) * dot.range;
          dot.x = dot.lockX + Math.sin(dot.angleX) * dot.range;
          dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${dot.scale})`;
        }

        if (!idle || i <= SINE_DOTS) {
          x += (next.x - dot.x) * 0.35;
          y += (next.y - dot.y) * 0.35;
        }
      }

      frameRef.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    resetTimer();
    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", onMove);
      while (container.firstChild) container.removeChild(container.firstChild);
      dotsRef.current = [];
    };
  }, []);

  return (
    <>
      {/* SVG goo filter */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="cursor-goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="6"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          filter: 'url("#cursor-goo")',
          willChange: "transform",
        }}
      />
    </>
  );
}
