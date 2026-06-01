"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import type { CreateTypes } from "canvas-confetti";

const SCORE_MAX = 900;
const MINOR_TICKS = 60;
const MAJOR_TICKS = 12;

// Background rings — bleed off-screen
const BG_SVG = 1500;
const BG_CX = BG_SVG / 2;
const BG_RINGS = [
  { r: 700, stroke: 30, speed: 12, direction: 1, opacity: 0.05 },
  { r: 650, stroke: 40, speed: 8, direction: -1, opacity: 0.06 },
  { r: 450, stroke: 35, speed: 15, direction: 1, opacity: 0.07 },
  { r: 400, stroke: 28, speed: 20, direction: -1, opacity: 0.06 },
  { r: 355, stroke: 22, speed: 25, direction: 1, opacity: 0.05 },
  { r: 320, stroke: 18, speed: 10, direction: -1, opacity: 0.04 },
  { r: 290, stroke: 14, speed: 18, direction: 1, opacity: 0.035 },
  { r: 265, stroke: 10, speed: 14, direction: -1, opacity: 0.03 },
];

// Foreground rings — fit inside viewport
const FG_SVG = 1000;
const FG_CX = FG_SVG / 2;
const OUTER_R = 440;
const OUTER_STROKE = 45;
const INNER_R = 370;
const INNER_STROKE = 32;

export function RentScoreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<CreateTypes | null>(null);
  const [progress, setProgress] = useState(0);
  const autoAngleRef = useRef(0);
  const bgSvgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef(0);

  const update = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollY = window.scrollY;
    const viewH = window.innerHeight;
    const sTop = section.offsetTop;
    const sHeight = section.offsetHeight;
    const start = sTop;
    const end = sTop + sHeight - viewH;

    if (scrollY <= start) setProgress(0);
    else if (scrollY >= end) setProgress(1);
    else setProgress((scrollY - start) / (end - start));
  }, []);

  useEffect(() => {
    const onScroll = () => requestAnimationFrame(update);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [update]);

  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.3;
      autoAngleRef.current = t;
      const svg = bgSvgRef.current;
      if (svg) {
        const circles = svg.querySelectorAll("circle");
        circles.forEach((circle, idx) => {
          if (idx >= BG_RINGS.length) return;
          const ring = BG_RINGS[idx];
          const circ = 2 * Math.PI * ring.r;
          const rotation = t * ring.speed * 0.01 * ring.direction;
          const dashLen = circ * (0.15 + Math.sin(t * 0.005 * ring.speed) * 0.1);
          const gapLen = circ * 0.08;
          circle.setAttribute("transform", `rotate(${rotation} ${BG_CX} ${BG_CX})`);
          circle.setAttribute("stroke-dasharray", `${dashLen} ${gapLen} ${dashLen * 0.6} ${gapLen * 1.5}`);
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const fillProgress = Math.min(1, progress * 1.25);
  const score = Math.round(fillProgress * SCORE_MAX);
  const textOpacity = progress < 0.05 ? 0 : progress < 0.15 ? (progress - 0.05) / 0.1 : 1;
  const subOpacity = progress < 0.3 ? 0 : progress < 0.45 ? (progress - 0.3) / 0.15 : 1;
  const firedRef = useRef(false);

  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (confettiCanvasRef.current && !confettiInstanceRef.current) {
      confettiInstanceRef.current = confetti.create(confettiCanvasRef.current, { resize: true });
    }
  }, []);

  useEffect(() => {
    if (score >= 900 && !firedRef.current && confettiInstanceRef.current) {
      firedRef.current = true;
      const fire = confettiInstanceRef.current;
      const colors = ["#ff9a6d", "#ffcbb0", "#ffffff", "#ff7b47"];
      const end = Date.now() + 2500;

      (function frame() {
        fire({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
        });
        fire({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
    if (score < 850) firedRef.current = false;
  }, [score]);

  const outerCirc = 2 * Math.PI * OUTER_R;
  const outerArc = outerCirc * 0.75;
  const outerFill = outerArc * fillProgress;
  const innerCirc = 2 * Math.PI * INNER_R;
  const innerArc = innerCirc * 0.75;
  const innerFill = innerArc * fillProgress;

  return (
    <section
      ref={sectionRef}
      className="relative [overflow:clip]"
      style={{ height: "600vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Confetti canvas — scoped to this section */}
        <canvas
          ref={confettiCanvasRef}
          className="pointer-events-none absolute inset-0 z-[50]"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Layer 1: Background auto-spinning rings — bleeds off-screen */}
        <svg
          ref={bgSvgRef}
          className="absolute"
          style={{ width: "150vmax", height: "150vmax" }}
          viewBox={`0 0 ${BG_SVG} ${BG_SVG}`}
        >
          {BG_RINGS.map((ring, idx) => (
            <circle
              key={idx}
              cx={BG_CX} cy={BG_CX} r={ring.r}
              fill="none"
              stroke="#ff9a6d"
              strokeOpacity={ring.opacity}
              strokeWidth={ring.stroke}
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* Layer 2: Foreground scroll rings + chronograph — fits in viewport */}
        <svg
          className="absolute"
          style={{ width: "min(114vh, 114vw)", height: "min(114vh, 114vw)" }}
          viewBox={`0 0 ${FG_SVG} ${FG_SVG}`}
        >
          {/* Chronograph tick marks */}
          {Array.from({ length: MINOR_TICKS }).map((_, i) => {
            const angle = (i / MINOR_TICKS) * 360 - 135;
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % (MINOR_TICKS / MAJOR_TICKS) === 0;
            const innerR = OUTER_R + OUTER_STROKE / 2 + 8;
            const outerR = innerR + (isMajor ? 28 : 14);
            const x1 = FG_CX + innerR * Math.cos(rad);
            const y1 = FG_CX + innerR * Math.sin(rad);
            const x2 = FG_CX + outerR * Math.cos(rad);
            const y2 = FG_CX + outerR * Math.sin(rad);
            const tickFrac = i / MINOR_TICKS;
            const isActive = tickFrac <= fillProgress * 0.75;

            return (
              <line
                key={`tick-${i}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isActive ? "#ff9a6d" : "rgba(255,255,255,0.1)"}
                strokeWidth={isMajor ? 3 : 1.5}
                strokeLinecap="round"
              />
            );
          })}

          {/* Outer scroll ring — track */}
          <circle
            cx={FG_CX} cy={FG_CX} r={OUTER_R}
            fill="none" stroke="rgba(255,255,255,0.06)"
            strokeWidth={OUTER_STROKE}
            strokeDasharray={`${outerArc} ${outerCirc}`}
            strokeLinecap="round"
            transform={`rotate(135 ${FG_CX} ${FG_CX})`}
          />
          {/* Outer scroll ring — fill */}
          <circle
            cx={FG_CX} cy={FG_CX} r={OUTER_R}
            fill="none" stroke="#ff9a6d"
            strokeWidth={OUTER_STROKE}
            strokeDasharray={`${outerFill} ${outerCirc}`}
            strokeLinecap="round"
            transform={`rotate(135 ${FG_CX} ${FG_CX})`}
          />

          {/* Inner scroll ring — track */}
          <circle
            cx={FG_CX} cy={FG_CX} r={INNER_R}
            fill="none" stroke="rgba(255,255,255,0.05)"
            strokeWidth={INNER_STROKE}
            strokeDasharray={`${innerArc} ${innerCirc}`}
            strokeLinecap="round"
            transform={`rotate(135 ${FG_CX} ${FG_CX})`}
          />
          {/* Inner scroll ring — fill */}
          <circle
            cx={FG_CX} cy={FG_CX} r={INNER_R}
            fill="none" stroke="#ff9a6d" strokeOpacity="0.6"
            strokeWidth={INNER_STROKE}
            strokeDasharray={`${innerFill} ${innerCirc}`}
            strokeLinecap="round"
            transform={`rotate(135 ${FG_CX} ${FG_CX})`}
          />
        </svg>

        {/* Text centered inside */}
        <div className="relative z-10 flex flex-col items-center gap-2 px-6 md:gap-4">
          <h2
            className="max-w-[550px] text-center text-[22px] font-normal leading-[1.2] tracking-[-0.8px] text-white md:text-[36px] lg:text-[44px] lg:tracking-[-1.5px]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: textOpacity,
              transform: `translateY(${(1 - textOpacity) * 20}px)`,
            }}
          >
            Your rent builds<br /><span className="text-[#ff9a6d]">more than a habit.</span>
          </h2>

          <span
            className="w-full text-center text-[56px] font-normal tracking-[-2px] text-white md:text-[96px] lg:text-[110px]"
            style={{ fontFamily: "'Geist Pixel Circle', sans-serif" }}
          >
            {score}
          </span>

          <p
            className="max-w-[220px] text-center text-[12px] font-normal leading-[1.6] text-[#a6a6a6] md:max-w-[440px] md:text-[15px] md:leading-[1.8] lg:text-[17px] lg:leading-[28px]"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: subOpacity,
              transform: `translateY(${(1 - subOpacity) * 15}px)`,
            }}
          >
            Every on-time payment builds your <span className="text-[#ff9a6d]">rent score</span> — proof that you&apos;re the kind of tenant landlords want. The higher your score, the more <span className="text-[#ff9a6d]">rewards</span> you access.
          </p>
        </div>
      </div>
    </section>
  );
}
