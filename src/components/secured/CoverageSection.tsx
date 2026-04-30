"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { FadeIn } from "./ui/FadeIn";
import { WordReveal } from "./ui/TextReveal";
import { ICON_COMPONENTS } from "./AnimatedCardIcons";
import type { CoverageContent } from "@/lib/secured/types";

function AnimatedSafetyNet() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <svg
      ref={ref}
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[200px] md:max-w-[280px] 3xl:max-w-[360px] 4xl:max-w-[440px] 5xl:max-w-[600px]"
    >
      {/* House outline */}
      <motion.path
        d="M100 20L40 60V130H160V60L100 20Z"
        stroke="#ff9a6d"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
      />
      {/* Roof */}
      <motion.path
        d="M30 62L100 14L170 62"
        stroke="#ff9a6d"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
      />
      {/* Door */}
      <motion.rect
        x="82"
        y="90"
        width="36"
        height="40"
        rx="2"
        stroke="#ff9a6d"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
      {/* Window left */}
      <motion.rect
        x="52"
        y="72"
        width="20"
        height="20"
        rx="2"
        stroke="#ff9a6d"
        strokeWidth="1"
        fill="none"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.6 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      />
      {/* Window right */}
      <motion.rect
        x="128"
        y="72"
        width="20"
        height="20"
        rx="2"
        stroke="#ff9a6d"
        strokeWidth="1"
        fill="none"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.6 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      />
      {/* Shield overlay */}
      <motion.path
        d="M100 40L66 54V80C66 100 82 114 100 120C118 114 134 100 134 80V54L100 40Z"
        stroke="#4ade80"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      />
      <motion.path
        d="M100 40L66 54V80C66 100 82 114 100 120C118 114 134 100 134 80V54L100 40Z"
        fill="#4ade80"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.06 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      />
      {/* Check inside shield */}
      <motion.path
        d="M88 78L96 86L112 70"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      />
      {/* Rupee symbol floating */}
      <motion.text
        x="170"
        y="50"
        fill="#ff9a6d"
        fontSize="18"
        fontWeight="600"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? {
          opacity: [0, 0.7, 0.7, 0],
          y: [10, 0, 0, -10],
        } : {}}
        transition={{ duration: 3, repeat: 2, delay: 2 }}
      >
        ₹
      </motion.text>
      <motion.text
        x="26"
        y="90"
        fill="#ff9a6d"
        fontSize="14"
        fontWeight="600"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? {
          opacity: [0, 0.5, 0.5, 0],
          y: [10, 0, 0, -10],
        } : {}}
        transition={{ duration: 3, repeat: 2, delay: 2.5 }}
      >
        ₹
      </motion.text>
    </svg>
  );
}

function CoveragePoint({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <div ref={ref}>
      <motion.div
        className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-[#1a1a1a] p-5 md:p-6 3xl:p-8 4xl:p-10 5xl:p-14"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, delay: index * 0.15 }}
      >
        <motion.div
          className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff9a6d]/10 3xl:h-8 3xl:w-8 4xl:h-10 4xl:w-10 5xl:h-14 5xl:w-14"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.3, delay: 0.2 + index * 0.15, ease: "backOut" }}
        >
          <svg className="w-3.5 h-3.5 3xl:w-4 3xl:h-4 4xl:w-5 4xl:h-5 5xl:w-7 5xl:h-7" viewBox="0 0 14 14" fill="none">
            <motion.path
              d="M3 7L6 10L11 4"
              stroke="#ff9a6d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.3, delay: 0.35 + index * 0.15 }}
            />
          </svg>
        </motion.div>
        <p
          className="text-base leading-[1.6] text-white md:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {text}
        </p>
      </motion.div>
    </div>
  );
}

export function CoverageSection({ data }: { data: CoverageContent }) {
  const hasDetailCards = data.detailCards && data.detailCards.length > 0;
  const hasPoints = data.points && data.points.length > 0;

  return (
    <section className="relative bg-[#131313]">
      {/* Heading */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="py-12 md:py-16 lg:px-[120px] lg:pb-[64px] lg:pt-[64px]">
          <div className="text-center">
            <h2
              className="mx-auto max-w-[850px] text-[28px] leading-[1.3] tracking-[-0.5px] md:text-[36px] lg:text-[40px] lg:leading-[1.4] lg:tracking-[-0.88px]"
              style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
            >
              {data.heading.split("\n").map((line, i) => {
                const isOrangeLine = /get paid/i.test(line);
                return (
                  <span key={i}>
                    {i > 0 && <br />}
                    <span className={isOrangeLine ? "text-[#ff9a6d]" : "text-white"}>{line}</span>
                  </span>
                );
              })}
            </h2>
            {data.subheading && (
              <FadeIn delay={0.2} className="mt-3 lg:mt-[16px]">
                <p
                  className="text-base leading-[1.6] text-[#797979] md:text-lg lg:text-[20px] lg:leading-[32px]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.subheading}
                </p>
              </FadeIn>
            )}
          </div>
        </div>
      </div>

      {/* Coverage points */}
      {hasPoints && (
        <SectionWrapper className="relative z-10">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24">
            <FadeIn className="flex flex-shrink-0 items-center justify-center md:order-1">
              <AnimatedSafetyNet />
            </FadeIn>
            <div className="flex flex-1 flex-col gap-3 md:order-2 md:gap-4">
              {data.points.map((point, i) => (
                <CoveragePoint key={i} text={point} index={i} />
              ))}
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Detail cards — 3-column grid */}
      {hasDetailCards && (
        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-0">
            {data.detailCards!.map((card, i) => (
              <DetailCard key={i} text={card.text} highlight={card.highlight} iconKey={card.iconKey} index={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function DetailCard({ text, highlight, iconKey, index }: { text: string; highlight?: string; iconKey?: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = iconKey ? ICON_COMPONENTS[iconKey] : null;

  const parts = highlight ? text.split(highlight) : [text];

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-4 border-[0.3px] border-[#4d4d4d] p-5 md:p-6 lg:-ml-[0.3px] lg:-mt-[0.3px] lg:px-[48px] lg:py-[48px]"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {Icon && (
        <div className="aspect-[4/3] w-full">
          {isInView && <Icon className="h-full w-full" />}
        </div>
      )}
      <p
        className="text-center text-[16px] font-normal leading-[24px] text-white"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {highlight && parts.length > 1 ? (
          <>
            {parts[0]}
            <span className="text-[#ff9a6d]">{highlight}</span>
            {parts[1]}
          </>
        ) : (
          text
        )}
      </p>
    </motion.div>
  );
}
