"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { FadeIn } from "./ui/FadeIn";
import type { WhyJoinContent } from "@/lib/secured/types";

function AnimatedArrowDown() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <svg
      ref={ref}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className="mx-auto my-4 w-8 h-8 md:w-10 md:h-10 3xl:w-12 3xl:h-12 4xl:w-14 4xl:h-14 5xl:w-20 5xl:h-20"
    >
      <motion.path
        d="M20 8V32M20 32L12 24M20 32L28 24"
        stroke="#ff9a6d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </svg>
  );
}

function ProblemItem({ text, index }: { text: string; index: number }) {
  return (
    <FadeIn delay={index * 0.12}>
      <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#1a1a1a] px-5 py-4 md:px-6 md:py-5 3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-7 5xl:px-14 5xl:py-10">
        <svg className="w-5 h-5 flex-shrink-0 3xl:w-6 3xl:h-6 4xl:w-7 4xl:h-7 5xl:w-10 5xl:h-10" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
          <path d="M7 7L13 13M13 7L7 13" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span
          className="text-sm leading-[1.5] text-[#c0c0c0] md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {text}
        </span>
      </div>
    </FadeIn>
  );
}

function SolutionItem({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <div ref={ref}>
      <FadeIn delay={0.1 + index * 0.12}>
        <div className="flex items-center gap-3 rounded-xl border border-[#ff9a6d]/10 bg-[#ff9a6d]/[0.04] px-5 py-4 md:px-6 md:py-5 3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-7 5xl:px-14 5xl:py-10">
          <motion.div
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7 5xl:h-10 5xl:w-10"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1, ease: "backOut" }}
          >
            <svg className="w-5 h-5 3xl:w-6 3xl:h-6 4xl:w-7 4xl:h-7 5xl:w-10 5xl:h-10" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#ff9a6d" strokeWidth="1.5" opacity="0.6" />
              <motion.path
                d="M6.5 10L9 12.5L13.5 7.5"
                stroke="#ff9a6d"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              />
            </svg>
          </motion.div>
          <span
            className="text-sm leading-[1.5] text-[#ff9a6d] md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {text}
          </span>
        </div>
      </FadeIn>
    </div>
  );
}

export function WhyJoinSection({ data }: { data: WhyJoinContent }) {
  return (
    <section className="relative py-12 md:py-24">
      <SectionWrapper className="relative z-10">
        <div className="mx-auto max-w-[560px] md:max-w-[640px] xl:max-w-[720px] 3xl:max-w-[900px] 4xl:max-w-[1100px] 5xl:max-w-[1500px]">
          {/* Problems */}
          <div className="flex flex-col gap-3 md:gap-4">
            {data.problems.map((problem, i) => (
              <ProblemItem key={i} text={problem} index={i} />
            ))}
          </div>

          {/* Arrow transition */}
          <AnimatedArrowDown />

          {/* Solution heading */}
          <FadeIn delay={0.3}>
            <h3 className="mb-4 text-center font-display text-[24px] leading-[1.3] tracking-[-0.5px] text-[#ff9a6d] md:mb-6 md:text-[32px] lg:text-[38px] xl:text-[44px] 3xl:text-[52px] 4xl:text-[64px] 5xl:text-[84px]">
              {data.solutionHeading}
            </h3>
          </FadeIn>

          {/* Solutions */}
          {data.solutions.length > 0 && (
            <div className="flex flex-col gap-3 md:gap-4">
              {data.solutions.map((solution, i) => (
                <SolutionItem key={i} text={solution} index={i} />
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>
    </section>
  );
}
