"use client";

import { useRef, useEffect } from "react";
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
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
    <section data-section="how-it-works" className="relative bg-[#131313]">
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

  useEffect(() => {
    stepButtonRefs.current[activeStep]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeStep]);

  return (
    <section data-section="how-it-works" className="bg-[#131313]">
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
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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

                <div className="-mx-6 flex w-[100vw] gap-2 overflow-x-auto px-6 pb-2 scrollbar-none" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                  {STEPS.map((step, i) => (
                    <button
                      key={i}
                      ref={(el) => { stepButtonRefs.current[i] = el; }}
                      onClick={() => setActiveStep(i)}
                      className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-left transition-all duration-300 ${
                        activeStep === i
                          ? "bg-[#cc7b57] text-[#060606]"
                          : "bg-[#1a1a1a] text-[#a9a9a9]"
                      }`}
                      style={{ maxWidth: "200px" }}
                    >
                      <p
                        className="text-xs leading-5"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {step.number}. {step.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop: heading + steps left, phone right */}
              <div className="hidden items-center lg:flex" style={{ gap: 80 }}>
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

                  <div className="flex flex-col gap-[8px]">
                    {STEPS.map((step, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        animate={{
                          backgroundColor: activeStep === i ? "#cc7b57" : "#1a1a1a",
                        }}
                        transition={{ duration: 0.4 }}
                        className="w-full cursor-pointer rounded-[16px] px-[32px] py-[20px] text-left"
                      >
                        <ol
                          className={`list-decimal text-[16px] leading-[24px] transition-colors duration-300 ${
                            activeStep === i
                              ? "text-[#060606]"
                              : "text-[#a9a9a9]"
                          }`}
                          style={{ fontFamily: "var(--font-ui)" }}
                          start={step.number}
                        >
                          <li className="ms-[24px]">
                            <span>{step.description}</span>
                          </li>
                        </ol>
                      </motion.button>
                    ))}
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
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
