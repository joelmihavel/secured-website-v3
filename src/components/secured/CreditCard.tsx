"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { SlideUp } from "./ui/TextReveal";
import { Button } from "./ui/Button";
import { ICON_COMPONENTS } from "./AnimatedCardIcons";
import type { CreditCardContent } from "@/lib/secured/types";
import { downloadAppCta } from "@/lib/secured/cta";

function CardShell({
  text,
  iconKey,
  accentText,
  opacity,
  translateY,
}: {
  text: string;
  iconKey: string;
  accentText?: string;
  opacity: number;
  translateY: number;
}) {
  const isVisible = opacity > 0.05;
  const Icon = ICON_COMPONENTS[iconKey];

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl"
      style={{
        transform: `translateY(${translateY}px)`,
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.06)",
        minHeight: "340px",
        height: "380px",
      }}
    >
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-8 pt-8">
        {Icon && <Icon className="h-full w-full" visible={isVisible} />}
      </div>
      <div className="px-6 pb-7 pt-4 text-center">
        {accentText && (
          <h3
            className="text-[20px] font-semibold leading-[1.3] tracking-[-0.3px] text-white"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {accentText}
          </h3>
        )}
        <p
          className="mt-1.5 text-[14px] font-normal leading-[1.5] text-[#808080]"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export function CreditCard({ data }: { data: CreditCardContent }) {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-40px" });

  return (
    <section data-section="credit-card" className="relative">
      {/* Card carousel behind phone */}
      <CardCarousel />

      {data.heading && <div className="h-[30px] md:h-[40px] lg:h-[60px]" />}

      {/* Text section */}
      {data.heading && (
        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div className="py-12 md:py-20 lg:px-[120px] lg:pb-[64px] lg:pt-[64px]">
            <div className="text-center">
              <motion.h2
                ref={headingRef}
                className="mx-auto max-w-[700px] text-[28px] font-normal leading-[1.3] tracking-[-1px] text-white md:text-[36px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={headingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                Rent goes on your credit card.
                <br />
                <span className="text-[#ff9a6d]">1% back, every time.</span>
              </motion.h2>

              <SlideUp delay={0.15}>
                <p
                  className="mx-auto mt-[16px] whitespace-nowrap text-[14px] font-normal leading-[1.8] text-[#a6a6a6] md:text-[16px] lg:text-[20px] lg:leading-[32px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Pay on time this month and get 0% convenience fees for 6 months.*
                </p>
              </SlideUp>
            </div>
          </div>
        </div>
      )}

      {/* Feature cards */}
      {data.featureCards.length > 0 && (
        <div className="relative mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          {/* Grid lines behind cards */}
          <div className="pointer-events-none absolute inset-x-6 inset-y-0 md:inset-x-12 lg:inset-x-[120px]" aria-hidden="true">
            <div className="absolute left-0 right-0 top-0 h-px bg-white/[0.04]" />
            <div className="absolute left-0 right-0 bottom-0 h-px bg-white/[0.04]" />
            <div className="absolute bottom-0 left-1/4 top-0 w-px bg-white/[0.04] hidden lg:block" />
            <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white/[0.04]" />
            <div className="absolute bottom-0 left-3/4 top-0 w-px bg-white/[0.04] hidden lg:block" />
          </div>
          <div className="relative grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
            {data.featureCards.map((card, i) => (
              <motion.div
                key={card.iconKey}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <CardShell
                  text={card.text}
                  iconKey={card.iconKey}
                  accentText={card.accentText}
                  opacity={1}
                  translateY={0}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

const CAROUSEL_CARDS = [
  "/assets/cards/carousel/card-1.webp",
  "/assets/cards/carousel/card-3.webp",
  "/assets/cards/carousel/card-4.webp",
  "/assets/cards/carousel/card-5.webp",
  "/assets/cards/carousel/card-6.webp",
];

function CardCarousel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const autoScrollRef = useRef(0);
  const isVisible = useInView(wrapRef, { once: true, margin: "200px" });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeftStart.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollLeftStart.current - (e.clientX - startX.current);
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const tick = () => {
      if (!isDragging.current && trackRef.current) {
        trackRef.current.scrollLeft += 0.5;
      }
      autoScrollRef.current = requestAnimationFrame(tick);
    };
    autoScrollRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(autoScrollRef.current);
  }, [isVisible]);

  const cards = [...CAROUSEL_CARDS, ...CAROUSEL_CARDS];

  return (
    <div ref={wrapRef} className="relative z-[5] flex items-center justify-center py-4 md:py-6" style={{ minHeight: "280px" }}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          ref={trackRef}
          className="no-scrollbar absolute inset-x-0 flex gap-5 overflow-x-auto px-6 md:gap-6 md:px-12"
          style={{ cursor: "grab", scrollBehavior: "auto", WebkitOverflowScrolling: "touch", top: "50%", transform: "translateY(-50%)" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {cards.map((src, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 overflow-hidden rounded-xl w-[240px] md:w-[300px] h-[150px] md:h-[190px]"
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <img
                src={src}
                alt=""
                draggable={false}
                loading="lazy"
                className="pointer-events-none h-full w-full select-none object-contain"
                style={{ filter: "brightness(0.55)" }}
              />
            </div>
          ))}
        </motion.div>
      )}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}
