"use client";

import { useRef, useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  MousePointerClick,
  Banknote,
  CalendarClock,
  DoorOpen,
  ShieldCheck,
} from "lucide-react";

const O = "#ff9a6d";
const S = "#1a1a1a";
const B = "#2a2a2a";

function useVis() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { rootMargin: "-40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const replay = () => setKey((k) => k + 1);
  return { ref, v, key, replay };
}

function Wrap({ children, className = "", onHover, animKey }: { children: React.ReactNode; className?: string; onHover?: () => void; animKey?: number }) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      onMouseEnter={onHover}
      onTouchStart={onHover}
    >
      <div key={animKey} className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ─── CASHBACK ───────────────────────────────────────────────
function CashbackScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-6">
        <div className="relative flex h-[170px] w-[170px] items-center justify-center">
          <svg viewBox="0 0 170 170" className="absolute inset-0 h-full w-full">
            <circle cx="85" cy="85" r="76" fill="none" stroke={`${O}15`} strokeWidth={5} />
            <motion.circle
              cx="85" cy="85" r="76" fill="none" stroke={O} strokeWidth={5}
              strokeLinecap="round" strokeDasharray="478"
              initial={{ strokeDashoffset: 478 }}
              animate={v ? { strokeDashoffset: 430 } : { strokeDashoffset: 478 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              transform="rotate(-90 85 85)"
            />
          </svg>
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-[48px] font-bold leading-none tracking-tight" style={{ color: O }}>1%</span>
            <span className="mt-1 text-[12px] uppercase tracking-[0.15em] text-white/40">back</span>
          </motion.div>
        </div>
        <motion.div
          className="flex items-center gap-2.5 rounded-full border px-5 py-2.5"
          style={{ borderColor: `${O}25`, background: `${O}08` }}
          initial={{ opacity: 0, y: 10 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="h-2 w-2 rounded-full" style={{ background: O }} />
          <span className="text-[14px] font-medium" style={{ color: O }}>+₹250 earned</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── ZERO DEPOSIT ───────────────────────────────────────────
function ZeroDepositScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-6">
        <div className="relative h-[150px] w-[130px]">
          <motion.svg
            viewBox="0 0 130 150" className="absolute inset-0 h-full w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <defs>
              <linearGradient id="shGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={O} stopOpacity={0.18} />
                <stop offset="100%" stopColor={O} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <path d="M65 8L12 32v46c0 36 53 62 53 62s53-26 53-62V32L65 8z" fill="url(#shGrad)" stroke={`${O}35`} strokeWidth={2} />
          </motion.svg>
          <motion.svg
            viewBox="0 0 24 24" className="absolute left-1/2 top-[40%] h-12 w-12 -translate-x-1/2 -translate-y-1/2"
            fill="none" stroke={O} strokeWidth={2.5}
          >
            <motion.path
              d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={v ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </motion.svg>
        </div>
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <span className="text-[18px] text-white/30 line-through">₹75,000</span>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="white" strokeWidth={1.5} opacity={0.25}>
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[24px] font-bold" style={{ color: O }}>₹0</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── MOVEOUT CASH ───────────────────────────────────────────
function MoveoutCashScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-6">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 12 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[52px] font-bold leading-none tracking-tight" style={{ color: O }}>₹15,000</span>
          <span className="mt-2 text-[13px] uppercase tracking-[0.15em] text-white/35">move-out bonus</span>
        </motion.div>
        <div className="flex items-center gap-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <motion.div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: `${O}15`, border: `2px solid ${O}40` }}
                initial={{ scale: 0 }}
                animate={v ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 300 }}
              >
                {i < 2 ? (
                  <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke={O} strokeWidth={2}>
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div className="h-2 w-2 rounded-full" style={{ background: O }} />
                )}
              </motion.div>
              {i < 2 && (
                <motion.div
                  className="h-[2px] w-8"
                  style={{ background: i === 0 ? `${O}35` : B }}
                  initial={{ scaleX: 0 }}
                  animate={v ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.15, duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

// ─── BETTER HOMES ───────────────────────────────────────────
function BetterHomesScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-6">
        <div className="relative h-[190px] w-[300px]">
          {[2, 1, 0].map((i) => (
            <motion.div
              key={i}
              className="absolute overflow-hidden rounded-2xl border"
              style={{
                borderColor: i === 0 ? `${O}25` : B,
                background: i === 0 ? `linear-gradient(145deg, ${S}, ${O}08)` : S,
                width: 280,
                height: 150,
                left: 10 + i * 8,
                top: i * 10,
                zIndex: 3 - i,
              }}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={v ? { opacity: i === 2 ? 0.25 : i === 1 ? 0.5 : 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (2 - i) }}
            >
              {i === 0 && (
                <div className="flex h-full flex-col justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ background: O }} />
                    <div className="h-2.5 w-28 rounded-full" style={{ background: `${O}20` }} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.svg
                        key={s} viewBox="0 0 12 12" className="h-4 w-4"
                        fill={s <= 4 ? O : "none"} stroke={O} strokeWidth={1}
                        initial={{ scale: 0 }}
                        animate={v ? { scale: 1 } : {}}
                        transition={{ delay: 0.5 + s * 0.06 }}
                      >
                        <path d="M6 1l1.5 3.1 3.5.5-2.5 2.4.6 3.5L6 8.9 2.9 10.5l.6-3.5L1 4.6l3.5-.5L6 1z" />
                      </motion.svg>
                    ))}
                    <span className="ml-2 text-[13px] text-white/25">Flent curated</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <motion.span
          className="text-[14px] uppercase tracking-[0.15em] text-white/30"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          Top 1% homes
        </motion.span>
      </div>
    </Wrap>
  );
}

// ─── RENTER PROFILE (First dibs on upcoming flent homes) ────
function RenterProfileScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        {/* Phone notification card */}
        <motion.div
          className="relative w-[220px] overflow-hidden rounded-2xl border"
          style={{ borderColor: `${O}18`, background: `linear-gradient(145deg, ${S}, ${O}06)` }}
          initial={{ opacity: 0, y: 14 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-3.5 p-5">
            {/* Notification header */}
            <div className="flex items-center gap-2.5">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: `${O}12` }}
                initial={{ scale: 0 }}
                animate={v ? { scale: 1 } : {}}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke={O} strokeWidth={1.5}>
                  <path d="M8 1.5v3M4.5 14.5h7M3 6a5 5 0 0110 0c0 2.5 1 4 1 4H2s1-1.5 1-4z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/30">Just now</span>
                <motion.span
                  className="text-[13px] font-medium" style={{ color: O }}
                  initial={{ opacity: 0 }}
                  animate={v ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  New home available
                </motion.span>
              </div>
            </div>
            {/* Property preview row */}
            <motion.div
              className="flex items-center gap-3 rounded-xl border px-3.5 py-3"
              style={{ borderColor: `${O}10`, background: `${O}04` }}
              initial={{ opacity: 0, x: -8 }}
              animate={v ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <div className="h-9 w-9 flex-shrink-0 rounded-lg" style={{ background: `${O}12` }} />
              <div className="flex flex-col gap-0.5">
                <div className="h-2 w-24 rounded-full" style={{ background: `${O}15` }} />
                <div className="h-2 w-16 rounded-full" style={{ background: `${O}08` }} />
              </div>
            </motion.div>
          </div>
        </motion.div>
        {/* #1 in queue badge */}
        <motion.div
          className="flex items-center gap-2 rounded-full border px-5 py-2.5"
          style={{ borderColor: `${O}25`, background: `${O}08` }}
          initial={{ opacity: 0, y: 8 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <span className="text-[20px] font-bold leading-none" style={{ color: O }}>#1</span>
          <span className="text-[13px] text-white/40">in queue</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── VACANCY COVER ──────────────────────────────────────────
function VacancyCoverScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="relative h-[150px] w-[130px]">
          <motion.svg
            viewBox="0 0 130 150" className="absolute inset-0 h-full w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <defs>
              <linearGradient id="vacGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={O} stopOpacity={0.18} />
                <stop offset="100%" stopColor={O} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <path d="M65 8L12 32v46c0 36 53 62 53 62s53-26 53-62V32L65 8z" fill="url(#vacGrad)" stroke={`${O}35`} strokeWidth={2} />
          </motion.svg>
          <motion.svg
            viewBox="0 0 24 24" className="absolute left-1/2 top-[40%] h-11 w-11 -translate-x-1/2 -translate-y-1/2"
            fill="none" stroke={O} strokeWidth={1.5}
            initial={{ opacity: 0 }}
            animate={v ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="9,22 9,12 15,12 15,22" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-3 w-12 rounded-full"
                style={{ background: O }}
                initial={{ scaleX: 0 }}
                animate={v ? { scaleX: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.3 }}
              />
            ))}
          </div>
          <span className="text-[15px] font-semibold" style={{ color: O }}>3 mo</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── TENANT EXIT / DAMAGE COVER (wrench + claim items) ──────
function TenantExitScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        {/* Wrench icon with orange accent */}
        <div className="relative flex h-[100px] w-[100px] items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ background: `${O}06`, border: `1.5px solid ${O}18` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          />
          <motion.svg
            viewBox="0 0 24 24" className="relative h-11 w-11" fill="none" stroke={O} strokeWidth={1.5}
            initial={{ opacity: 0, rotate: -15 }}
            animate={v ? { opacity: 1, rotate: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
        {/* Damage claim items */}
        <div className="w-[240px] space-y-2">
          {[
            { label: "Wall repair", amt: "₹8,000", covered: true },
            { label: "Appliance wear", amt: "₹4,500", covered: true },
            { label: "Deep cleaning", amt: "₹3,000", covered: true },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between rounded-lg border px-4 py-2.5"
              style={{ borderColor: `${O}12`, background: `${O}04` }}
              initial={{ opacity: 0, x: -12 }}
              animate={v ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
            >
              <span className="text-[12px] text-white/45">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: O }}>{item.amt}</span>
                <motion.svg
                  viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke={O} strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={v ? { scale: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.12, type: "spring", stiffness: 400 }}
                >
                  <path d="M1.5 5l2.5 2.5L8.5 3" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

// ─── VERIFICATION ───────────────────────────────────────────
function VerificationScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-6">
        <div className="relative flex h-[130px] w-[130px] items-center justify-center">
          <div className="absolute inset-0 rounded-3xl" style={{ background: `${O}05`, border: `1.5px solid ${O}15` }} />
          <motion.svg
            viewBox="0 0 24 24" className="relative h-14 w-14" fill="none" stroke={O} strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={v ? { opacity: 0.8 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 018 4" strokeLinecap="round" />
            <path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6 1.7 0 3.2.7 4.3 1.8" strokeLinecap="round" />
            <path d="M8.5 22c.4-2 .5-4 .5-6 0-2 1.3-3.5 3-3.5s3 1.5 3 3.5c0 1.5-.3 3-.8 4.5" strokeLinecap="round" />
            <path d="M14 22c.3-1 .5-2.5.5-4" strokeLinecap="round" />
          </motion.svg>
          <motion.div
            className="absolute left-3 right-3 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${O}, transparent)` }}
            initial={{ top: "25%", opacity: 0 }}
            animate={v ? { top: ["25%", "75%", "25%"], opacity: [0, 0.9, 0] } : {}}
            transition={{ duration: 2.5, repeat: 2, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
        <div className="flex gap-5">
          {["Identity", "Background", "Credit"].map((label, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={v ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.12 }}
            >
              <motion.div
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: `${O}15`, border: `1.5px solid ${O}30` }}
                initial={{ scale: 0 }}
                animate={v ? { scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.12, type: "spring", stiffness: 400 }}
              >
                <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke={O} strokeWidth={2}>
                  <path d="M1.5 5l2.5 2.5L8.5 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <span className="text-[11px] text-white/35">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

// ─── GROWTH / LOAN ──────────────────────────────────────────
function GrowthScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  const bars = [30, 38, 35, 48, 42, 58, 52, 68, 62, 78, 72, 90];
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="flex items-end gap-[5px]" style={{ height: 130, width: 260 }}>
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-[3px]"
              style={{
                background: i >= 10
                  ? `linear-gradient(180deg, ${O}, ${O}80)`
                  : `${O}${i >= 8 ? "30" : "15"}`,
              }}
              initial={{ height: 0 }}
              animate={v ? { height: `${h}%` } : { height: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] as const }}
            />
          ))}
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <span className="text-[15px] text-white/35">Rental income</span>
          <span className="text-[18px] font-bold" style={{ color: O }}>↑ 12%</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── SETUP FAST ─────────────────────────────────────────────
function SetupFastScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="relative flex h-[160px] w-[160px] items-center justify-center">
          <svg viewBox="0 0 160 160" className="absolute inset-0">
            <circle cx="80" cy="80" r="72" fill="none" stroke={`${O}10`} strokeWidth={4} />
            <motion.circle
              cx="80" cy="80" r="72" fill="none" stroke={O} strokeWidth={4}
              strokeLinecap="round" strokeDasharray="452"
              initial={{ strokeDashoffset: 452 }}
              animate={v ? { strokeDashoffset: 30 } : { strokeDashoffset: 452 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
              transform="rotate(-90 80 80)"
            />
          </svg>
          <motion.svg
            viewBox="0 0 24 24" className="relative h-12 w-12" fill="none" stroke={O} strokeWidth={1.5}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          >
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" strokeLinejoin="round" />
          </motion.svg>
        </div>
        <motion.div
          className="flex items-baseline gap-2"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <span className="text-[32px] font-bold" style={{ color: O }}>2 min</span>
          <span className="text-[15px] text-white/35">setup</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── CARD POINTS ────────────────────────────────────────────
function CardPointsScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <motion.div
          className="relative w-[260px] overflow-hidden rounded-2xl border"
          style={{
            borderColor: `${O}18`,
            background: `linear-gradient(145deg, ${S} 0%, ${O}06 100%)`,
            aspectRatio: "1.6 / 1",
          }}
          initial={{ opacity: 0, y: 12, rotateX: 8 }}
          animate={v ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex h-full flex-col justify-between p-5">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((d) => (
                  <div key={d} className="h-1.5 w-1.5 rounded-full" style={{ background: `${O}35` }} />
                ))}
              </div>
              <div className="h-5 w-7 rounded-[3px] border" style={{ borderColor: `${O}25` }} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-white/25">Points earned</div>
              <motion.span
                className="text-[32px] font-bold leading-none tracking-tight"
                style={{ color: O }}
                initial={{ opacity: 0 }}
                animate={v ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                2,450
              </motion.span>
            </div>
          </div>
        </motion.div>
        <motion.span
          className="text-[12px] text-white/30"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          +50 per ₹10K rent
        </motion.span>
      </div>
    </Wrap>
  );
}

// ─── BREATHING ROOM ─────────────────────────────────────────
function BreathingRoomScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="relative flex h-[170px] w-[170px] items-center justify-center">
          <svg viewBox="0 0 170 170" className="absolute inset-0">
            <circle cx="85" cy="85" r="76" fill="none" stroke={`${O}12`} strokeWidth={5} strokeDasharray="8 4" />
            <motion.circle
              cx="85" cy="85" r="76" fill="none" stroke={O} strokeWidth={5}
              strokeLinecap="round" strokeDasharray="478"
              initial={{ strokeDashoffset: 478 }}
              animate={v ? { strokeDashoffset: 0 } : { strokeDashoffset: 478 }}
              transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
              transform="rotate(-90 85 85)"
            />
          </svg>
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={v ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <span className="text-[48px] font-bold leading-none" style={{ color: O }}>45</span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.15em] text-white/35">days</span>
          </motion.div>
        </div>
        <motion.span
          className="text-[13px] text-white/35"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          Interest-free window
        </motion.span>
      </div>
    </Wrap>
  );
}

// ─── LOW FEES ───────────────────────────────────────────────
function LowFeesScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="w-[260px] space-y-4">
          {[
            { label: "Others", pct: 80, val: "1.5–2%", color: "rgba(255,255,255,0.12)" },
            { label: "Secured", pct: 20, val: "~0.5%", color: O },
          ].map((bar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={v ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <div className="mb-1.5 flex justify-between">
                <span className="text-[13px] text-white/40">{bar.label}</span>
                <span className="text-[13px] font-semibold" style={{ color: i === 1 ? O : "rgba(255,255,255,0.35)" }}>{bar.val}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full" style={{ background: B }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bar.color }}
                  initial={{ width: 0 }}
                  animate={v ? { width: `${bar.pct}%` } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.2, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="flex items-center gap-2 rounded-full border px-5 py-2"
          style={{ borderColor: `${O}25`, background: `${O}08` }}
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          <span className="text-[14px] font-semibold" style={{ color: O }}>Save 70%</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── CREDIT REPORT (Complimentary tenant credit report) ─────
function CreditReportScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <motion.div
          className="relative w-[200px] overflow-hidden rounded-2xl border"
          style={{ borderColor: `${O}18`, background: `linear-gradient(145deg, ${S}, ${O}06)` }}
          initial={{ opacity: 0, y: 14 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" style={{ color: O }} strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.12em] text-white/30">Tenant report</span>
                <span className="text-[14px] font-semibold" style={{ color: O }}>Verified</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {["Credit score", "Rental history", "Employment"].map((label, i) => (
                <motion.div
                  key={i} className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -8 }}
                  animate={v ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.12 }}
                >
                  <span className="text-[11px] text-white/40">{label}</span>
                  <motion.div
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: `${O}15` }}
                    initial={{ scale: 0 }}
                    animate={v ? { scale: 1 } : {}}
                    transition={{ delay: 0.6 + i * 0.12, type: "spring", stiffness: 400 }}
                  >
                    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke={O} strokeWidth={2}>
                      <path d="M1.5 5l2.5 2.5L8.5 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 rounded-full border px-4 py-2"
          style={{ borderColor: `${O}25`, background: `${O}08` }}
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          <span className="text-[12px] font-medium" style={{ color: O }}>Free with Secured</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── SIMPLE SIGNUP (Simple, one-click signup) ───────────────
function SimpleSignupScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-6">
        <div className="relative flex h-[140px] w-[140px] items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `${O}06`, border: `1.5px solid ${O}15` }}
            initial={{ scale: 0 }}
            animate={v ? { scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 250 }}
          >
            <MousePointerClick className="relative h-14 w-14" style={{ color: O }} strokeWidth={1.2} />
          </motion.div>
          <motion.div
            className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: `${O}18`, border: `2px solid ${O}45` }}
            initial={{ scale: 0 }}
            animate={v ? { scale: 1 } : {}}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            <svg viewBox="0 0 10 10" className="h-3.5 w-3.5" fill="none" stroke={O} strokeWidth={2}>
              <path d="M1.5 5l2.5 2.5L8.5 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
        <motion.div
          className="flex items-baseline gap-2"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <span className="text-[28px] font-bold" style={{ color: O }}>1 click</span>
          <span className="text-[14px] text-white/35">to start</span>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── INSTANT PAYOUTS (Instant payouts, zero paperwork) ──────
function InstantPayoutsScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="relative flex h-[120px] w-[120px] items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ background: `${O}05`, border: `1.5px solid ${O}15` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={v ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Banknote className="relative h-12 w-12" style={{ color: O }} strokeWidth={1.2} />
          </motion.div>
        </div>
        {/* Payout timeline */}
        <div className="flex items-center gap-2">
          {["Rent paid", "Processed", "In your bank"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                className="flex flex-col items-center gap-1.5"
                initial={{ opacity: 0, y: 6 }}
                animate={v ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <motion.div
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ background: `${O}15`, border: `1.5px solid ${O}30` }}
                  initial={{ scale: 0 }}
                  animate={v ? { scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 400 }}
                >
                  <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke={O} strokeWidth={2}>
                    <path d="M1.5 5l2.5 2.5L8.5 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <span className="text-[9px] text-white/35">{label}</span>
              </motion.div>
              {i < 2 && (
                <motion.div
                  className="mb-4 h-[1.5px] w-6"
                  style={{ background: `${O}30` }}
                  initial={{ scaleX: 0 }}
                  animate={v ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.15, duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

// ─── VACANCY CALENDAR (30-day vacancy → collect rent) ───────
function VacancyCalendarScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="relative flex h-[120px] w-[120px] items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ background: `${O}06`, border: `1.5px solid ${O}15` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 250 }}
          >
            <CalendarClock className="relative h-12 w-12" style={{ color: O }} strokeWidth={1.2} />
          </motion.div>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-baseline gap-1.5"
            initial={{ opacity: 0 }}
            animate={v ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <span className="text-[32px] font-bold leading-none" style={{ color: O }}>30</span>
            <span className="text-[13px] text-white/35">days</span>
          </motion.div>
          <motion.div
            className="h-5 w-[1px]" style={{ background: `${O}25` }}
            initial={{ scaleY: 0 }}
            animate={v ? { scaleY: 1 } : {}}
            transition={{ delay: 0.7 }}
          />
          <motion.span
            className="text-[13px] font-medium" style={{ color: O }}
            initial={{ opacity: 0 }}
            animate={v ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            1 month rent
          </motion.span>
        </div>
      </div>
    </Wrap>
  );
}

// ─── EXIT NOTICE (tenant leaves without notice) ─────────────
function ExitNoticeScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="relative flex h-[120px] w-[120px] items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ background: `${O}06`, border: `1.5px solid ${O}15` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={v ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <DoorOpen className="relative h-12 w-12" style={{ color: O }} strokeWidth={1.2} />
          </motion.div>
        </div>
        {/* Deposit adjustment flow */}
        <div className="flex items-center gap-2">
          {["Deposit", "Adjusted", "Paid out"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                className="flex flex-col items-center gap-1.5"
                initial={{ opacity: 0, y: 6 }}
                animate={v ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <motion.div
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ background: `${O}15`, border: `1.5px solid ${O}30` }}
                  initial={{ scale: 0 }}
                  animate={v ? { scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 400 }}
                >
                  {i < 2 ? (
                    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke={O} strokeWidth={2}>
                      <path d="M1.5 5l2.5 2.5L8.5 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[8px] font-bold" style={{ color: O }}>₹</span>
                  )}
                </motion.div>
                <span className="text-[9px] text-white/35">{label}</span>
              </motion.div>
              {i < 2 && (
                <motion.div
                  className="mb-4 h-[1.5px] w-5"
                  style={{ background: `${O}30` }}
                  initial={{ scaleX: 0 }}
                  animate={v ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.15, duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

// ─── BGV REPORT (Complimentary tenant BGV) ──────────────────
function BgvReportScene({ className = "" }: { className?: string }) {
  const { ref, v, key, replay } = useVis();
  return (
    <Wrap className={className} onHover={replay} animKey={key}>
      <div ref={ref} className="relative flex flex-col items-center gap-5">
        <div className="relative flex h-[120px] w-[120px] items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ background: `${O}05`, border: `1.5px solid ${O}15` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 250 }}
          >
            <ShieldCheck className="relative h-12 w-12" style={{ color: O }} strokeWidth={1.2} />
          </motion.div>
        </div>
        <motion.div
          className="w-[200px] overflow-hidden rounded-xl border"
          style={{ borderColor: `${O}15`, background: `${O}04` }}
          initial={{ opacity: 0, y: 8 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="space-y-0">
            {["Criminal records", "Address verification", "ID check"].map((label, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between border-b px-4 py-2 last:border-b-0"
                style={{ borderColor: `${O}10` }}
                initial={{ opacity: 0 }}
                animate={v ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <span className="text-[11px] text-white/40">{label}</span>
                <motion.span
                  className="text-[10px] font-semibold" style={{ color: O }}
                  initial={{ opacity: 0 }}
                  animate={v ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  Clear
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── EXPORTS ────────────────────────────────────────────────
const SCENE_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  cashback: memo(CashbackScene),
  "zero-deposit": memo(ZeroDepositScene),
  "moveout-cash": memo(MoveoutCashScene),
  "better-homes": memo(BetterHomesScene),
  "renter-profile": memo(RenterProfileScene),
  "vacancy-cover": memo(VacancyCoverScene),
  "tenant-exit": memo(TenantExitScene),
  verification: memo(VerificationScene),
  growth: memo(GrowthScene),
  "setup-fast": memo(SetupFastScene),
  "card-points": memo(CardPointsScene),
  "breathing-room": memo(BreathingRoomScene),
  "low-fees": memo(LowFeesScene),
  "credit-report": memo(CreditReportScene),
  "simple-signup": memo(SimpleSignupScene),
  "instant-payouts": memo(InstantPayoutsScene),
  "vacancy-calendar": memo(VacancyCalendarScene),
  "exit-notice": memo(ExitNoticeScene),
  "bgv-report": memo(BgvReportScene),
};

export const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = SCENE_MAP;
