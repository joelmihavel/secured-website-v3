"use client";

import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const STRIP_COUNT = 7;
const STORAGE_KEY = "secured_preloader_seen";

// useLayoutEffect runs synchronously before paint on the client, but warns
// during SSR. Fall back to useEffect on the server so SSR doesn't error.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);
  // Default to showing the loader so SSR + first client render both render it,
  // matching hydration. We only flip skip=true when sessionStorage says the
  // user has already seen the preloader this session — checked synchronously
  // before paint to avoid a flash.
  const [skip, setSkip] = useState(false);

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = window.sessionStorage.getItem(STORAGE_KEY);
      if (seen === "1") {
        setSkip(true);
        setDone(true);
        setVisible(false);
      }
    } catch {
      // sessionStorage may be unavailable (private mode); fall through to playing the preloader
    }
  }, []);

  const animate = useCallback(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = current < 30 ? 1 : current < 70 ? 2 : current < 90 ? 3 : 5;
      current = Math.min(100, current + increment);
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
      }
    }, 21);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (skip) return;
    const cleanup = animate();
    return cleanup;
  }, [animate, skip]);

  useEffect(() => {
    if (done && !skip) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      const timeout = setTimeout(() => setVisible(false), 1400);
      return () => clearTimeout(timeout);
    }
  }, [done, skip]);

  if (!visible || skip) return null;

  return (
    <AnimatePresence>
      {!done && (
        <div className="fixed inset-0 z-[100]">
          {/* Strips overlay */}
          {Array.from({ length: STRIP_COUNT }).map((_, i) => {
            const center = (STRIP_COUNT - 1) / 2;
            const distFromCenter = Math.abs(i - center);
            const delay = distFromCenter * 0.06;

            return (
              <motion.div
                key={i}
                className="absolute top-0 h-full bg-[#0F0F0F]"
                style={{
                  left: `${(i / STRIP_COUNT) * 100}%`,
                  width: `${100 / STRIP_COUNT + 0.5}%`,
                }}
                exit={{ scaleY: 0 }}
                transition={{
                  duration: 0.6,
                  delay,
                  ease: [0.76, 0, 0.24, 1],
                }}
              />
            );
          })}

          {/* Hero background textures */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[70%] opacity-[0.4] lg:w-[579px] lg:opacity-[0.6]">
              <Image
                src="/assets/backgrounds/hero-texture-left.svg"
                alt=""
                fill
                className="object-cover"
                aria-hidden="true"
              />
            </div>
            <div className="absolute right-0 top-0 hidden h-full w-[591px] opacity-[0.2] lg:block">
              <Image
                src="/assets/backgrounds/hero-texture-right.png"
                alt=""
                fill
                className="object-cover"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Content layer */}
          <motion.div
            className="absolute inset-0 flex flex-col px-6 py-12 md:px-10 md:py-16 lg:px-[120px] lg:py-[160px]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Flent logo — top left */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/assets/logos/flent-logo.svg"
                alt="Flent"
                width={84}
                height={30}
                priority
              />
            </motion.div>

            {/* Middle area — percentage right-aligned */}
            <div className="flex flex-1 items-center justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <span className="font-body text-[117px] leading-[1] tracking-[-2px] text-white md:text-[174px] lg:text-[234px]">
                  {progress}%
                </span>
              </motion.div>
            </div>

            {/* Bottom — subheading + progress bar */}
            <div className="flex flex-col gap-4">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="font-body text-lg leading-[1.4] tracking-[-0.5px] text-white md:text-xl lg:text-2xl"
              >
                welcome to the right side of renting
              </motion.p>

              {/* Progress bar with circle indicator */}
              <div className="relative h-[3px] w-full bg-white/10">
                <div className="relative h-full" style={{ width: `${progress}%` }}>
                  <div className="h-full w-full bg-white" />
                  <div
                    className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#ff9a6d]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
