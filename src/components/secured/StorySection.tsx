"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*░▒▓█▄▀■□";

function useGlitchReveal(text: string, progress: number, threshold: number) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (progress < threshold) {
      setDisplay("");
      return;
    }

    const localP = Math.min(1, (progress - threshold) / 0.08);

    if (localP >= 1) {
      setDisplay(text);
      return;
    }

    const revealedCount = Math.floor(localP * text.length);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " " || text[i] === "\n") {
        result += text[i];
      } else if (i < revealedCount) {
        result += text[i];
      } else if (i < revealedCount + 4) {
        result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      } else {
        result += " ";
      }
    }
    setDisplay(result);
  }, [text, progress, threshold]);

  return display;
}

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

  const update = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollY = window.scrollY;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const viewH = window.innerHeight;

    const start = sectionTop - viewH * 0.5;
    const end = sectionTop + sectionHeight - viewH;

    if (scrollY <= start) {
      setProgress(0);
    } else if (scrollY >= end) {
      setProgress(1);
    } else {
      setProgress((scrollY - start) / (end - start));
    }
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

  const heading1 = "Rent is your biggest\nmonthly commitment.";
  const heading2 = "You've handled it responsibly,\nbut it's never really\nled to anything.";
  const bottomText = "Secured changes that with a simple cashback today, and ultimately opens doors to renting benefits that you truly deserve.";

  const glitch1 = useGlitchReveal(heading1, progress, 0.05);
  const glitch2 = useGlitchReveal(heading2, progress, 0.30);

  // Heading 1: fade in 0.05-0.13, visible 0.13-0.22, fade out 0.22-0.28
  const h1Opacity = progress < 0.05 ? 0
    : progress < 0.13 ? (progress - 0.05) / 0.08
    : progress < 0.22 ? 1
    : progress < 0.28 ? 1 - (progress - 0.22) / 0.06
    : 0;

  // Heading 2: fade in 0.30-0.38, visible 0.38-0.47, fade out 0.47-0.53
  const h2Opacity = progress < 0.30 ? 0
    : progress < 0.38 ? (progress - 0.30) / 0.08
    : progress < 0.47 ? 1
    : progress < 0.53 ? 1 - (progress - 0.47) / 0.06
    : 0;

  // Bottom text: rises 0.58-0.68, word-by-word grey→white 0.62-0.88, fades 0.90-1.0
  const btRise = progress < 0.58 ? 0
    : progress < 0.68 ? (progress - 0.58) / 0.10
    : 1;

  const btOpacity = progress < 0.58 ? 0
    : progress < 0.68 ? (progress - 0.58) / 0.10
    : progress < 0.90 ? 1
    : 1 - (progress - 0.90) / 0.10;

  const bottomWords = bottomText.split(" ");
  const revealProgress = progress < 0.62 ? 0
    : progress < 0.88 ? (progress - 0.62) / 0.26
    : 1;

  return (
    <section
      ref={sectionRef}
      data-section="story"
      className="relative"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Heading 1 — left, cursor bubble */}
        <div
          className="absolute left-3 md:left-6 lg:left-[120px] z-[12]"
          style={{
            opacity: h1Opacity,
            transform: `translateY(${(1 - h1Opacity) * 40}px) scale(${0.9 + h1Opacity * 0.1})`,
          }}
        >
          <div className="relative inline-block">
            <div
              className="rounded-[18px] px-4 py-3 sm:rounded-[22px] sm:px-6 sm:py-4 md:rounded-[26px] md:px-8 md:py-5"
              style={{ background: "#ff9a6d" }}
            >
              <h2
                className="whitespace-pre-line text-[16px] font-normal leading-[1.3] tracking-[-0.5px] text-[#1a1a1a] sm:text-[20px] md:text-[24px] lg:text-[28px] lg:leading-[40px] lg:tracking-[-1px]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {glitch1}
              </h2>
            </div>
            {/* iMessage tail — bottom left */}
            <svg className="absolute -bottom-1 left-3 h-4 w-4" viewBox="0 0 16 16" fill="#ff9a6d">
              <path d="M16 0C16 0 12 0 8 4C4 8 0 16 0 16C4 14 10 10 16 10V0Z" />
            </svg>
          </div>
        </div>

        {/* Heading 2 — right, cursor bubble */}
        <div
          className="absolute right-3 md:right-6 lg:right-[120px] z-[12]"
          style={{
            opacity: h2Opacity,
            transform: `translateY(${(1 - h2Opacity) * 40}px) scale(${0.9 + h2Opacity * 0.1})`,
          }}
        >
          <div className="relative inline-block">
            <div
              className="rounded-[18px] px-4 py-3 sm:rounded-[22px] sm:px-6 sm:py-4 md:rounded-[26px] md:px-8 md:py-5"
              style={{ background: "#e8784a" }}
            >
              <h2
                className="whitespace-pre-line text-right text-[20px] font-normal leading-[1.3] tracking-[-0.5px] text-[#1a1a1a] md:text-[24px] lg:text-[28px] lg:leading-[40px] lg:tracking-[-1px]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {glitch2}
              </h2>
            </div>
            {/* iMessage tail — bottom right */}
            <svg className="absolute -bottom-1 right-3 h-4 w-4 -scale-x-100" viewBox="0 0 16 16" fill="#e8784a">
              <path d="M16 0C16 0 12 0 8 4C4 8 0 16 0 16C4 14 10 10 16 10V0Z" />
            </svg>
          </div>
        </div>

        {/* Bottom centered text — word-by-word grey to white on scroll */}
        <div
          className="absolute inset-x-6 bottom-[6%] z-[12] mx-auto max-w-[700px] text-center md:bottom-[8%] md:inset-x-12 lg:inset-x-[120px]"
          style={{
            opacity: btOpacity,
            transform: `translateY(${(1 - btRise) * 80}px)`,
          }}
        >
          <p
            className="text-[20px] font-normal leading-[1.5] tracking-[-0.5px] md:text-[24px] lg:text-[28px] lg:leading-[44px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {bottomWords.map((word, i) => {
              const wordProgress = i / bottomWords.length;
              const isRevealed = revealProgress > wordProgress;
              return (
                <span
                  key={i}
                  style={{
                    color: isRevealed ? "#ffffff" : "#454545",
                    transition: "color 0.3s ease",
                  }}
                >
                  {word}{i < bottomWords.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
