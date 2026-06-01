"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

interface WordRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export function WordReveal({ children, className = "", delay = 0 }: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: "-20px 0px -20px 0px", once: true });
  const words = children.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{
              duration: isInView ? 0.5 : 0.2,
              ease: [0.25, 0.1, 0.25, 1] as const,
              delay: isInView ? delay + i * 0.04 : 0,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

/* ── Glitch / scramble reveal ── */

const GLYPHS = "▄▀▂▬░▒▓█▐▕";

function scrambleText(text: string, progress: number): string {
  return text
    .split("")
    .map((char, i) => {
      if (char === " " || char === "\n") return char;
      if (i / text.length < progress) return char;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

interface GlitchRevealProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function GlitchReveal({
  children,
  duration = 1.0,
  delay = 0,
  className = "",
}: GlitchRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [scrambled, setScrambled] = useState<string | null>(null);
  const plainText = useRef("");
  const animating = useRef(false);

  const runAnimation = useCallback(() => {
    if (animating.current) return;
    animating.current = true;

    const text = plainText.current;
    if (!text) {
      animating.current = false;
      return;
    }

    setScrambled(scrambleText(text, 0));
    const totalFrames = Math.round(duration * 60);
    const delayFrames = Math.round(delay * 60);
    let frame = -delayFrames;

    const tick = () => {
      frame++;
      if (frame < 0) {
        setScrambled(scrambleText(text, 0));
        requestAnimationFrame(tick);
        return;
      }
      const progress = easeOutQuart(Math.min(frame / totalFrames, 1));
      if (progress >= 1) {
        setScrambled(null);
        animating.current = false;
        return;
      }
      setScrambled(scrambleText(text, progress));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [duration, delay]);

  // Capture plain text from a hidden render of children
  const hiddenRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (hiddenRef.current) {
      plainText.current = hiddenRef.current.textContent || "";
    }
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (hiddenRef.current) {
            plainText.current = hiddenRef.current.textContent || "";
          }
          runAnimation();
        } else {
          animating.current = false;
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [runAnimation]);

  return (
    <span ref={containerRef} className={className}>
      {/* Hidden span to extract plain text from children */}
      <span
        ref={hiddenRef}
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        {children}
      </span>
      {scrambled !== null ? scrambled : children}
    </span>
  );
}

interface SlideUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SlideUp({ children, className = "", delay = 0 }: SlideUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20px 0px -20px 0px", once: true });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{
          duration: isInView ? 0.6 : 0.2,
          ease: [0.25, 0.1, 0.25, 1] as const,
          delay: isInView ? delay : 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
