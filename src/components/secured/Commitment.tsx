"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { SlideUp } from "./ui/TextReveal";
import { ICON_COMPONENTS } from "./AnimatedCardIcons";
import type { CommitmentContent } from "@/lib/secured/types";

function CornerPlus({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass =
    position === "tl" ? "top-[6px] left-[6px]"
    : position === "tr" ? "top-[6px] right-[6px]"
    : position === "bl" ? "bottom-[6px] left-[6px]"
    : "bottom-[6px] right-[6px]";

  return (
    <svg
      className={`absolute ${posClass} z-[2]`}
      width="10" height="10" viewBox="0 0 12 12" fill="none"
    >
      <path d="M6 1.5V10.5" stroke="#ff9a6d" strokeWidth="1" strokeLinecap="round" />
      <path d="M1.5 6H10.5" stroke="#ff9a6d" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function CardShell({
  text,
  iconKey,
  accentText,
  tag,
  opacity,
  translateY,
}: {
  text: string;
  iconKey: string;
  accentText?: string;
  tag?: "live" | "coming-soon";
  opacity: number;
  translateY: number;
}) {
  const isVisible = opacity > 0.05;
  const Icon = ICON_COMPONENTS[iconKey];

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl h-[380px] md:h-[420px] lg:h-[460px] min-h-[360px] md:min-h-[400px] lg:min-h-[420px]"
      style={{
        transform: `translateY(${translateY}px)`,
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Illustration area — top portion */}
      <div className="relative flex items-center justify-center px-8 pt-8" style={{ height: "55%" }}>
        {Icon && <Icon className="h-full w-full" visible={isVisible} />}
      </div>

      {/* Text area — bottom, centered */}
      <div className="flex flex-1 flex-col justify-center px-6 pb-8 pt-4 text-center">
        {accentText && (
          <h3
            className="text-[24px] font-semibold leading-[1.3] tracking-[-0.4px] text-white md:text-[26px]"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {accentText}
          </h3>
        )}
        <p
          className="mt-2 text-[15px] font-normal leading-[1.6] text-[#808080] md:text-[16px]"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {text}
        </p>
        {tag && (
          <div className="mt-4 flex justify-center">
            {tag === "live" ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-[#4CAF50]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4CAF50]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4CAF50] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
                </span>
                Live now
              </span>
            ) : (
              <span
                className="inline-flex items-center rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#797979]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Coming soon
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TenantCommitment({ data }: { data: CommitmentContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

  const update = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollY = window.scrollY;
    const viewH = window.innerHeight;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    const start = sectionTop - viewH * 0.3;
    const end = sectionTop + sectionHeight - viewH;

    if (scrollY <= start) setProgress(0);
    else if (scrollY >= end) setProgress(1);
    else setProgress((scrollY - start) / (end - start));
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

  const cards = data.benefitCards;
  const leftCards = cards.slice(0, 3);
  const rightCards = cards.slice(3, 6);

  // Staggered show/hide: only one card visible at a time
  // Order: L1, R1, L2, R2, L3, R3
  // Each card gets ~0.15 of progress: 0.03 fade in, 0.09 visible, 0.03 fade out
  function getCardStyle(order: number) {
    const slotSize = 1 / 6;
    const start = order * slotSize;
    const fadeIn = start;
    const fadeInEnd = start + slotSize * 0.2;
    const fadeOutStart = start + slotSize * 0.75;
    const fadeOutEnd = start + slotSize;

    let opacity: number;
    if (progress < fadeIn) opacity = 0;
    else if (progress < fadeInEnd) opacity = (progress - fadeIn) / (fadeInEnd - fadeIn);
    else if (progress < fadeOutStart) opacity = 1;
    else if (progress < fadeOutEnd) opacity = 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
    else opacity = 0;

    const y = opacity < 1 && progress < fadeOutStart ? 30 * (1 - opacity) : 0;

    return { opacity, translateY: y };
  }

  return (
    <section ref={sectionRef} data-section="commitment" className="relative" style={{ height: "630vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">

          {/* Mobile: stacked, one at a time */}
          <div className="flex items-center justify-center lg:hidden">
            <div className="relative w-full max-w-[400px] h-[380px] md:h-[420px] lg:h-[460px]">
              {cards.map((card, i) => {
                const style = getCardStyle(i);
                return (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{ opacity: style.opacity, transform: `translateY(${style.translateY}px)`, pointerEvents: style.opacity > 0.5 ? "auto" : "none" }}
                  >
                    <CardShell
                      text={card.text}
                      iconKey={card.iconKey}
                      accentText={card.accentText}
                      tag={card.tag}
                      opacity={style.opacity}
                      translateY={0}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop: left column | phone gap | right column */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
            {/* Left column — one card at a time */}
            <div className="relative h-[380px] md:h-[420px] lg:h-[460px]">
              {leftCards.map((card, i) => {
                const style = getCardStyle(i * 2); // L1=0, L2=2, L3=4
                return (
                  <div
                    key={`l-${i}`}
                    className="absolute inset-0"
                    style={{ opacity: style.opacity, transform: `translateY(${style.translateY}px)`, pointerEvents: style.opacity > 0.5 ? "auto" : "none" }}
                  >
                    <CardShell
                      text={card.text}
                      iconKey={card.iconKey}
                      accentText={card.accentText}
                      tag={card.tag}
                      opacity={style.opacity}
                      translateY={0}
                    />
                  </div>
                );
              })}
            </div>

            {/* Center spacer for phone */}
            <div style={{ width: "min(420px, 30vw)" }} />

            {/* Right column — one card at a time */}
            <div className="relative h-[380px] md:h-[420px] lg:h-[460px]">
              {rightCards.map((card, i) => {
                const style = getCardStyle(i * 2 + 1); // R1=1, R2=3, R3=5
                return (
                  <div
                    key={`r-${i}`}
                    className="absolute inset-0"
                    style={{ opacity: style.opacity, transform: `translateY(${style.translateY}px)`, pointerEvents: style.opacity > 0.5 ? "auto" : "none" }}
                  >
                    <CardShell
                      text={card.text}
                      iconKey={card.iconKey}
                      accentText={card.accentText}
                      tag={card.tag}
                      opacity={style.opacity}
                      translateY={0}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandlordCommitment({ data }: { data: CommitmentContent }) {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section className="relative">
      {(data.subtitle || data.heading || data.description) && (
        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div className="py-12 md:py-20 lg:px-[120px] lg:pb-[64px] lg:pt-[48px]">
            <div className="text-center">
              {data.subtitle && (
                <SlideUp>
                  <p
                    className="text-sm leading-[1.6] tracking-[-0.32px] text-[#a6a6a6] md:text-base lg:text-[16px] lg:uppercase lg:tracking-[0.309px]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {data.subtitle}
                  </p>
                </SlideUp>
              )}

              {data.heading && (
                <motion.h2
                  ref={headingRef}
                  className="mx-auto mt-3 max-w-[750px] text-[28px] leading-[1.3] tracking-[-1px] text-white md:mt-4 md:text-[36px] lg:max-w-[715px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px]"
                  style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={headingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {data.heading}
                </motion.h2>
              )}

              {data.description && (
                <SlideUp delay={0.3} className="mt-4 lg:mt-[16px]">
                  <p
                    className="mx-auto max-w-[700px] text-base leading-[1.7] text-[#888] md:text-lg lg:max-w-[850px] lg:text-[20px] lg:leading-[32px] lg:text-[#797979]"
                    style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
                  >
                    {data.description}
                  </p>
                </SlideUp>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.benefitCards.map((card, i) => {
            const Icon = ICON_COMPONENTS[card.iconKey];
            return (
              <motion.div
                key={i}
                className="relative flex flex-col overflow-hidden rounded-2xl"
                style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.06)" }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <div className="relative flex flex-1 items-center justify-center overflow-hidden px-8 pt-8" style={{ minHeight: 200 }}>
                  {Icon && <Icon className="h-full w-full" visible />}
                </div>
                <div className="px-6 pb-7 pt-4 text-center">
                  {card.accentText && (
                    <h3
                      className="text-[20px] font-semibold leading-[1.3] tracking-[-0.3px] text-white"
                      style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
                    >
                      {card.accentText}
                    </h3>
                  )}
                  <p
                    className="mt-1.5 text-[14px] font-normal leading-[1.5] text-[#808080]"
                    style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
                  >
                    {card.text}
                  </p>
                  {card.tag && (
                    <div className="mt-3 flex justify-center">
                      {card.tag === "live" ? (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#4CAF50]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#4CAF50]"
                          style={{ fontFamily: "var(--font-ui)" }}
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4CAF50] opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
                          </span>
                          Live now
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#797979]"
                          style={{ fontFamily: "var(--font-ui)" }}
                        >
                          Coming soon
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Commitment({
  data,
  variant = "tenant",
}: {
  data: CommitmentContent;
  variant?: "tenant" | "landlord";
}) {
  if (variant === "landlord") return <LandlordCommitment data={data} />;
  return <TenantCommitment data={data} />;
}
