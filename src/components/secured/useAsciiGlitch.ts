"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export function useAsciiGlitch(text: string, initialDelay = 600) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);
  const glitchingRef = useRef(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    glitchingRef.current = false;
    setDisplay(text);
  }, [text]);

  const triggerGlitch = useCallback(() => {
    if (glitchingRef.current) return;
    glitchingRef.current = true;
    const t = textRef.current;
    const len = t.length;
    const charDuration = 40;
    const stagger = 30;
    const totalDuration = stagger * (len - 1) + charDuration;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      let result = "";

      for (let i = 0; i < len; i++) {
        if (t[i] === " ") {
          result += " ";
          continue;
        }
        const charStart = i * stagger;
        const charEnd = charStart + charDuration;

        if (elapsed >= charEnd) {
          result += t[i];
        } else if (elapsed >= charStart) {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        } else {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      setDisplay(result);

      if (elapsed < totalDuration) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(t);
        glitchingRef.current = false;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const initTimer = setTimeout(triggerGlitch, initialDelay);
    const loopTimer = setInterval(triggerGlitch, 8000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(loopTimer);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      glitchingRef.current = false;
    };
  }, [triggerGlitch, initialDelay]);

  return { display, triggerGlitch };
}
