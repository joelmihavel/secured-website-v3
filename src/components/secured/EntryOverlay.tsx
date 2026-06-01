"use client";

import { useState, useEffect, useRef } from "react";
interface EntryOverlayProps {
  onEnter: () => void;
}

export function EntryOverlay({ onEnter }: EntryOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

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

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (exiting) return;
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

    setExiting(true);
    document.body.style.overflow = "";
    document.body.style.cursor = "";
    onEnter();

    // Position and trigger the expanding ripple
    const ripple = rippleRef.current;
    if (ripple) {
      const maxDist = Math.ceil(Math.sqrt(
        Math.max(clientX, window.innerWidth - clientX) ** 2 +
        Math.max(clientY, window.innerHeight - clientY) ** 2
      ));
      const size = maxDist * 2.2;
      ripple.style.left = `${clientX}px`;
      ripple.style.top = `${clientY}px`;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.marginLeft = `${-size / 2}px`;
      ripple.style.marginTop = `${-size / 2}px`;
    }

    setTimeout(() => setVisible(false), 1100);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes ripple-expand {
          0% { transform: scale(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>

      {/* Dark tint — cosmic bg from PageContent shows through since it's at z-0 fixed */}
      <div
        className="fixed inset-0 z-[9997]"
        style={{
          background: "rgba(0,0,0,0.15)",
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* Expanding ripple circle on click */}
      <div
        ref={rippleRef}
        className="fixed z-[9997] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,154,109,0.3) 0%, rgba(255,154,109,0.1) 40%, transparent 70%)",
          transform: "scale(0)",
          animation: exiting ? "ripple-expand 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
        }}
      />

      {/* Clickable layer + cursor */}
      <div
        className="fixed inset-0 z-[9999] cursor-none"
        style={{
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.6s ease 0.3s",
        }}
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        {!exiting && (
          <>
            {/* Desktop: follows mouse */}
            <div
              ref={circleRef}
              className="pointer-events-none fixed hidden md:block"
              style={{
                left: -200,
                top: -200,
                width: 200,
                height: 200,
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

            {/* Mobile: centered, pulsing, always visible */}
            <div
              className="pointer-events-none fixed left-1/2 top-1/2 md:hidden"
              style={{
                width: 160,
                height: 160,
                transform: "translate(-50%, -50%)",
                animation: "pulse-ring 2s ease-in-out infinite",
              }}
            >
              <style>{`
                @keyframes pulse-ring {
                  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
                  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
                }
              `}</style>
              <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="96" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.6" />
                <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span
                  className="text-[12px] font-normal tracking-[0.1em] text-white/70"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  TAP TO
                </span>
                <span
                  className="text-[14px] font-medium tracking-[-0.3px] text-[#ff9a6d]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Enter Secured
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
