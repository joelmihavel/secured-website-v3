"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useInView } from "framer-motion";
import { useState } from "react";
import { SlideUp } from "./ui/TextReveal";
import type { GettingStartedContent } from "@/lib/secured/types";

const FRAME = "/assets/illustrations/iphone-frame";

function IPhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "335 / 682" }}>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/bezel.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/bezel-stroke.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/glass.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/glass-stroke.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.73% 39.64% 98.94% 39.41%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/speaker.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 39.52% 98.88% 39.29%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/speaker-stroke.svg`} />
      </div>
      <div
        className="absolute overflow-hidden"
        style={{ inset: "2.02% 4.56% 2.02% 4.78%", borderRadius: "10.5% / 5.2%" }}
      >
        {children}
      </div>
      <div className="absolute" style={{ inset: "28.33% 0 60.58% 99.32%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/buttons-right.svg`} />
      </div>
      <div className="absolute" style={{ inset: "20.04% 99.09% 55.66% 0" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/buttons-left.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.11% 0.68% 0.11% 0.91%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/antenna.svg`} />
      </div>
      <div className="absolute" style={{ inset: "3.58% 36.22% 92.16% 35.99%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/dynamic-island.svg`} />
      </div>
    </div>
  );
}

const screenVariants = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

const CARD_ROTATIONS = [4.9, -8.25, 6.17, -8.69];

function StickyCard({
  step,
  index,
}: {
  step: { number: number; title: string; description: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" as `${number}px` });
  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];
  const topOffset = 200 + index * 60;

  const lines = step.description.split("\n");
  const orangeLineCount = Math.ceil(lines.length / 2);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center"
      style={{
        position: "sticky",
        top: topOffset,
        zIndex: index + 1,
        marginBottom: 40,
      }}
    >
      <motion.div
        className="relative mx-auto w-[240px] md:w-[270px]"
        style={{ rotate: rotation }}
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.92 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="relative" style={{ aspectRatio: "270 / 321" }}>
          <img
            src="/assets/illustrations/notepad-cards/card-bg.svg"
            alt=""
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center px-6 md:px-8">
            <p
              className="text-center text-[16px] leading-[24px]"
              style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
            >
              {lines.map((line, i) => (
                <span key={i}>
                  {i > 0 && "\n"}
                  <span className={i < orangeLineCount ? "text-[#ff9a6d]" : "text-[#a9a9a9]"}>
                    {line}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LandlordGettingStarted({ data }: { data: GettingStartedContent }) {
  const STEPS = data.steps;
  return (
    <section data-section="how-it-works" className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden px-0 lg:px-[120px]">
        <img
          src="/assets/backgrounds/concentric-circles.svg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain object-center"
        />
      </div>

      <div className="relative z-10">
        <div className="h-[60px] md:h-[80px] lg:h-[120px]" />

        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div className="py-8 md:py-12 lg:px-[120px] lg:pb-[48px] lg:pt-[64px]">
            <div className="text-center">
              <SlideUp>
                <p
                  className="text-sm leading-[1.6] tracking-[-0.32px] text-[#999] md:text-base lg:text-[20px] lg:leading-[32px] lg:text-[#797979]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.sectionLabel}
                </p>
              </SlideUp>
              <h2
                className="mx-auto mt-3 max-w-[850px] text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:mt-4 md:text-[34px] lg:mt-[16px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <span className="text-white">Setup in under </span>
                <span className="text-[#ff9a6d]">5 minutes</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div className="lg:px-[120px]">
            <div className="pb-[200px] pt-[40px]">
              {STEPS.map((step, i) => (
                <StickyCard
                  key={i}
                  step={step}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GettingStarted({
  data,
  variant = "tenant",
}: {
  data: GettingStartedContent;
  variant?: "tenant" | "landlord";
}) {
  if (variant === "landlord") {
    return <LandlordGettingStarted data={data} />;
  }
  return <TenantGettingStarted data={data} />;
}

function TenantGettingStarted({ data }: { data: GettingStartedContent }) {
  const STEPS = data.steps;
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stepCount = STEPS.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const step = Math.min(Math.floor(v * stepCount), stepCount - 1);
    setActiveStep(step);
  });

  const hasMountedRef = useRef(false);
  useEffect(() => {
    // Skip the initial run: with activeStep=0 on mount, scrollIntoView
    // would scroll the page down to the carousel (which lives below the
    // hero), yanking the user away from the first fold.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const btn = stepButtonRefs.current[activeStep];
    if (!btn) return;
    // Only auto-center if the button is already on screen — never let
    // scrollIntoView pull the page back to the section from elsewhere.
    const rect = btn.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    btn.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeStep]);

  const scrollToStep = useCallback((i: number) => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.offsetTop;
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const targetY = sectionTop + (i / stepCount) * (sectionHeight - viewportHeight);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, [stepCount]);

  return (
    <section data-section="how-it-works">
      {/* Scroll-pinned container */}
      <div ref={sectionRef} className="relative" style={{ height: `${stepCount * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto w-full px-6 pb-8 pt-24 md:px-12 md:py-16 lg:px-[120px] lg:py-[120px]">
            <div className="lg:px-[240px]">
              {/* Mobile: heading, phone centered, horizontal step carousel below */}
              <div className="flex flex-col items-center gap-4 lg:hidden">
                <div className="w-full">
                  <SlideUp>
                    <p
                      className="text-sm leading-[1.6] tracking-[-0.32px] text-[#999] md:text-base"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {data.sectionLabel}
                    </p>
                  </SlideUp>
                  <h2
                    className="mt-3 text-[24px] leading-[1.3] tracking-[-0.5px] text-white md:text-[34px]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    <span className="text-white">Getting started is</span>
                    <br />
                    <span className="text-[#ff9a6d]">simple &amp; straightforward</span>
                  </h2>
                </div>

                <IPhoneFrame className="w-[180px]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={activeStep}
                      variants={screenVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={STEPS[activeStep].phone}
                        alt={`Step ${activeStep + 1}`}
                        width={608}
                        height={1309}
                        className="h-full w-full object-cover object-top"
                      />
                    </motion.div>
                  </AnimatePresence>
                </IPhoneFrame>

                <div
                  className="-mx-6 flex w-[100vw] gap-3 overflow-x-auto px-6 pb-3 pt-1 scrollbar-none"
                  style={{
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {STEPS.map((step, i) => {
                    const isActive = activeStep === i;
                    return (
                      <button
                        key={i}
                        ref={(el) => { stepButtonRefs.current[i] = el; }}
                        onClick={() => scrollToStep(i)}
                        className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1a1a1a] text-left transition-shadow duration-300"
                        style={{
                          width: "min(220px, 70vw)",
                          scrollSnapAlign: "center",
                          boxShadow: isActive
                            ? "0 8px 24px rgba(255, 154, 109, 0.18)"
                            : "0 2px 8px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="step-active-mobile"
                            className="absolute inset-0 bg-[#ff9a6d]"
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                          />
                        )}
                        <div className="relative px-4 py-3">
                          <span
                            className={`block text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 ${
                              isActive ? "text-[#1a1a1a]/70" : "text-[#777]"
                            }`}
                            style={{ fontFamily: "var(--font-ui)" }}
                          >
                            Step {step.number}
                          </span>
                          <p
                            className={`mt-1 text-[12px] font-medium leading-[18px] transition-colors duration-200 ${
                              isActive ? "text-[#131313]" : "text-[#cfcfcf]"
                            }`}
                            style={{ fontFamily: "var(--font-ui)" }}
                          >
                            {step.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Desktop: heading + steps left, phone right */}
              <div className="hidden items-center lg:flex" style={{ gap: "min(80px, 5vw)" }}>
                {/* Left — heading + step list */}
                <div className="flex flex-1 flex-col gap-[32px]">
                  <div>
                    <SlideUp>
                      <p
                        className="text-[20px] leading-[32px] text-[#797979]"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {data.sectionLabel}
                      </p>
                    </SlideUp>
                    <h2
                      className="mt-[16px] text-[40px] leading-[1.3] tracking-[-0.88px] text-white"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      <span className="text-white">Getting started is</span>
                      <br />
                      <span className="text-[#ff9a6d]">simple &amp; straightforward</span>
                    </h2>
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    {STEPS.map((step, i) => {
                      const isActive = activeStep === i;
                      return (
                        <button
                          key={i}
                          onClick={() => scrollToStep(i)}
                          className="relative w-full cursor-pointer overflow-hidden rounded-[16px] border border-white/[0.06] bg-[#1a1a1a] text-left transition-shadow duration-300"
                          style={{
                            boxShadow: isActive
                              ? "0 12px 32px rgba(255, 154, 109, 0.18)"
                              : "0 2px 12px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="step-active-desktop"
                              className="absolute inset-0 bg-[#ff9a6d]"
                              transition={{ type: "spring", stiffness: 280, damping: 30 }}
                            />
                          )}
                          <div className="relative flex items-start gap-[20px] px-[28px] py-[20px]">
                            <span
                              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-[13px] font-bold leading-none transition-colors duration-200 ${
                                isActive
                                  ? "border-[#131313]/30 bg-[#131313]/10 text-[#131313]"
                                  : "border-white/10 bg-white/[0.04] text-[#cfcfcf]"
                              }`}
                              style={{ fontFamily: "var(--font-ui)" }}
                            >
                              {step.number}
                            </span>
                            <p
                              className={`mt-[3px] text-[16px] leading-[24px] transition-colors duration-200 ${
                                isActive ? "text-[#131313]" : "text-[#cfcfcf]"
                              }`}
                              style={{ fontFamily: "var(--font-ui)" }}
                            >
                              {step.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right — Phone mockup */}
                <div className="mt-[24px] flex flex-shrink-0">
                  <IPhoneFrame className="w-[336px]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={activeStep}
                        variants={screenVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={STEPS[activeStep].phone}
                          alt={`Step ${activeStep + 1}`}
                          width={608}
                          height={1309}
                          className="h-full w-full object-cover object-top"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </IPhoneFrame>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
