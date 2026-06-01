"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const MIN_SCORE = 26;
const MAX_SCORE = 900;
const RANGE = MAX_SCORE - MIN_SCORE;

const MILESTONES = [26, 100, 200, 300, 400, 500, 600, 650, 750, 900];

function scoreToColor(score: number): string {
  if (score < 300) return "#ef4444";
  if (score < 500) return "#f97316";
  if (score < 650) return "#eab308";
  if (score < 750) return "#22c55e";
  return "#ff9a6d";
}

function playTick(ctx: AudioContext) {
  const now = ctx.currentTime;
  const duration = 0.012;

  // Short noise burst — the mechanical "click" of a crown detent
  const bufferSize = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // Highpass filter — removes low rumble, keeps the sharp click
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2500 + Math.random() * 500;
  hp.Q.value = 1.5;

  // Slight resonance — the metallic ring of the crown mechanism
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 4000 + Math.random() * 1000;
  bp.Q.value = 15;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(hp);
  hp.connect(bp);
  bp.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration);
}

export function ScrollCreditScore() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastMilestoneRef = useRef(-1);

  const update = useCallback(() => {
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    if (!main || !footer) return;

    const scrollY = window.scrollY;
    const mainTop = main.offsetTop;
    const footerTop = footer.offsetTop;
    const viewH = window.innerHeight;

    const start = mainTop + viewH * 0.3;
    const end = footerTop - viewH * 0.3;

    if (scrollY < start) {
      setProgress(0);
      setVisible(scrollY > mainTop + 50);
    } else if (scrollY > end) {
      setVisible(false);
    } else {
      const p = (scrollY - start) / (end - start);
      setProgress(Math.max(0, Math.min(1, p)));
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    let initialized = false;
    const initAudio = () => {
      if (initialized) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      audioCtxRef.current.resume().then(() => {
        initialized = true;
      });
    };
    const events = ["click", "touchstart", "keydown", "mousedown", "scroll"] as const;
    events.forEach((e) => document.addEventListener(e, initAudio, { passive: true }));
    return () => {
      events.forEach((e) => document.removeEventListener(e, initAudio));
    };
  }, []);

  useEffect(() => {
    const currentScore = Math.round(MIN_SCORE + RANGE * progress);

    if (currentScore !== lastMilestoneRef.current && visible) {
      lastMilestoneRef.current = currentScore;
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === "running") {
        playTick(ctx);
      }
    }
  }, [progress, visible]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    // Retry until main/footer are found
    const retryInterval = setInterval(() => {
      if (document.querySelector("main") && document.querySelector("footer")) {
        clearInterval(retryInterval);
        update();
      }
    }, 100);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      clearInterval(retryInterval);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  const currentScore = Math.round(MIN_SCORE + RANGE * progress);
  const currentColor = scoreToColor(currentScore);

  const [viewH, setViewH] = useState(800);
  useEffect(() => {
    setViewH(window.innerHeight);
    const onResize = () => setViewH(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const spacing = viewH * 0.33;
  const totalHeight = (MILESTONES.length - 1) * spacing;
  const arrowScreenY = viewH * 0.5;
  const scrollOffset = progress * totalHeight;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        overflow: "hidden",
      }}
    >
      {/* Fixed arrow + score indicator */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 2,
        }}
      >
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" style={{ transform: "rotate(90deg)" }}>
          <path d="M8 0L16 18H0L8 0Z" fill={currentColor} />
        </svg>
        <span
          style={{
            fontFamily: '"Geist Pixel Triangle", monospace',
            fontSize: 14,
            lineHeight: "20px",
            color: "#ddd",
            transition: "color 0.3s ease",
          }}
        >
          {currentScore}
        </span>
      </div>

      {/* Milestone lines */}
      {MILESTONES.map((milestone, i) => {
        const milestoneY = arrowScreenY + i * spacing - scrollOffset;
        const reached = currentScore >= milestone;
        const color = scoreToColor(milestone);

        return (
          <div
            key={milestone}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: milestoneY,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 40,
                top: -16,
                fontFamily: '"Geist Pixel Triangle", monospace',
                fontSize: 11,
                color: reached ? color : "rgba(255,255,255,0.15)",
                opacity: reached ? 0.5 : 0.25,
                letterSpacing: "0.02em",
                fontVariantNumeric: "tabular-nums",
                transition: "color 0.4s ease, opacity 0.4s ease",
              }}
            >
              {milestone}
            </span>
            <div
              style={{
                width: "100%",
                height: "0.5px",
                backgroundColor: reached ? color : "rgba(255,255,255,0.04)",
                opacity: reached ? 0.15 : 0.06,
                transition: "background-color 0.4s ease, opacity 0.4s ease",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
