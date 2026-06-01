"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { EntryOverlay } from "./EntryOverlay";

interface AudioState {
  playing: boolean;
  toggle: () => void;
  unlocked: boolean;
}

const AudioCtx = createContext<AudioState>({ playing: false, toggle: () => {}, unlocked: false });
export const useAudio = () => useContext(AudioCtx);

let globalAudio: HTMLAudioElement | null = null;

function getAudio() {
  if (!globalAudio) {
    globalAudio = new Audio("/assets/audio/bg-music.mp3");
    globalAudio.loop = true;
    globalAudio.volume = 0.35;
  }
  return globalAudio;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const toggle = useCallback(() => {
    const audio = getAudio();
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  const startAudio = useCallback(() => {
    if (unlocked) return;
    setUnlocked(true);
    const audio = getAudio();
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [unlocked]);


  return (
    <AudioCtx.Provider value={{ playing, toggle, unlocked }}>
      {!unlocked && <EntryOverlay onEnter={startAudio} />}
      {children}
    </AudioCtx.Provider>
  );
}

export function AudioToggle() {
  const { playing, toggle } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 28;
    const H = 20;
    canvas.width = W * 2;
    canvas.height = H * 2;

    const bars = 4;
    const barW = 3;
    const gap = 4;
    const phases = [0, 0.7, 1.4, 2.1];
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W * 2, H * 2);
      t += 0.08;

      for (let i = 0; i < bars; i++) {
        const x = (i * (barW + gap) + 2) * 2;
        let barH: number;

        if (playing) {
          barH = (0.3 + 0.7 * Math.abs(Math.sin(t + phases[i]))) * H * 1.6;
        } else {
          barH = 4;
        }

        const y = (H * 2 - barH) / 2;
        ctx.fillStyle = "#ff9a6d";
        ctx.fillRect(x, y, barW * 2, barH);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
      style={{ width: "32px", height: "32px" }}
      aria-label={playing ? "Mute" : "Unmute"}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "28px", height: "20px" }}
      />
    </button>
  );
}
