"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EntryOverlayProps {
  onEnter: () => void;
}

export function EntryOverlay({ onEnter }: EntryOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.cursor = "none";
    return () => {
      document.body.style.overflow = "";
      document.body.style.cursor = "";
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (circleRef.current) {
        circleRef.current.style.left = `${e.clientX}px`;
        circleRef.current.style.top = `${e.clientY}px`;
      }
    };
    const onTouch = (e: TouchEvent) => {
      if (circleRef.current && e.touches[0]) {
        circleRef.current.style.left = `${e.touches[0].clientX}px`;
        circleRef.current.style.top = `${e.touches[0].clientY}px`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const handleClick = () => {
    if (exiting) return;
    setExiting(true);
    document.body.style.overflow = "";
    document.body.style.cursor = "";
    onEnter();
    setTimeout(() => setVisible(false), 1000);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[9998] cursor-none"
          style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(13,13,13,0.5)" }}
          onClick={handleClick}
          onTouchStart={handleClick}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={circleRef}
            className="pointer-events-none fixed"
            style={{
              left: -200,
              top: -200,
              width: "clamp(140px, 30vw, 200px)",
              height: "clamp(140px, 30vw, 200px)",
              transform: "translate(-50%, -50%)",
              willChange: "left, top",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="96" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.6" />
              <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span
                className="text-[13px] font-normal tracking-[0.1em] text-white/70"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                ENTER
              </span>
              <span
                className="text-[15px] font-medium tracking-[-0.3px] text-[#ff9a6d]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Secured
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="overlay-exit"
          className="fixed inset-0 z-[9998] pointer-events-none"
          style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(13,13,13,0.5)" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
