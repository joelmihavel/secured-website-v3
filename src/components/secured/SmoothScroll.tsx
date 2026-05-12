"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const INTERACTION_EVENTS = ["pointerdown", "wheel", "touchstart", "keydown"] as const;

export function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId = 0;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      cleanupTriggers();

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        anchors: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    };

    // Defer Lenis init off the critical path. Whichever fires first wins:
    // the first user interaction (pointer/wheel/touch/key) or the browser's
    // idle callback. Until then the page uses native scrolling, which the
    // user perceives as identical for the very first moments after load.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(start, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(start, 1200);
    }

    for (const evt of INTERACTION_EVENTS) {
      window.addEventListener(evt, start, { once: true, passive: true });
    }

    function cleanupTriggers() {
      if (idleId !== undefined && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      for (const evt of INTERACTION_EVENTS) {
        window.removeEventListener(evt, start);
      }
    }

    return () => {
      cleanupTriggers();
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return null;
}
