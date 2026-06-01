"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const REPEAT = 14;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export function PhoneRibbonTransition({
  text1,
  text2,
}: {
  text1: string;
  text2: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
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
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  const marqueeOpacity =
    progress < 0.35 ? 0 : progress < 0.5 ? smoothstep((progress - 0.35) / 0.15) : 1;

  const clipPercent =
    progress < 0.35 ? 36 :
    progress < 0.7 ? 36 * (1 - smoothstep((progress - 0.35) / 0.35)) : 0;

  return (
    <>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <section
        ref={sectionRef}
        data-section="ribbon-transition"
        className="relative"
        style={{ height: "300vh" }}
      >
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          {marqueeOpacity > 0 && (
            <div
              className="absolute inset-x-0 z-[20] flex flex-col items-center"
              style={{
                opacity: marqueeOpacity,
                clipPath: `inset(0 ${clipPercent}%)`,
                transition: "clip-path 0.1s ease-out",
              }}
            >
              <MarqueeStrip
                text={text1}
                bg="#1a1a1a"
                textColor="#999999"
                direction="left"
                rotate="0.22deg"
              />
              <MarqueeStrip
                text={text2}
                bg="#cc7b57"
                textColor="#131313"
                direction="right"
                rotate="-0.48deg"
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function MarqueeStrip({
  text,
  bg,
  textColor,
  direction,
  rotate,
}: {
  text: string;
  bg: string;
  textColor: string;
  direction: "left" | "right";
  rotate: string;
}) {
  return (
    <div
      className="w-[200vw] overflow-hidden py-2.5 md:py-3"
      style={{ transform: `rotate(${rotate})`, backgroundColor: bg }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee-${direction} 30s linear infinite`,
        }}
      >
        {Array.from({ length: REPEAT }).map((_, i) => (
          <span
            key={i}
            className="mx-5 text-[12px] font-bold tracking-[0.02em] md:mx-7 md:text-[13px]"
            style={{ fontFamily: "var(--font-ui)", color: textColor }}
          >
            {text}
            <span className="mx-5 opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
