"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionBlockProps {
  number?: number;
  label: string;
  totalItems?: number;
  heading: string;
  headingMuted?: string;
  children: React.ReactNode;
  bg?: string;
}

export function SectionBlock({
  number,
  label,
  totalItems,
  heading,
  headingMuted,
  children,
  bg = "#0f0f0f",
}: SectionBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const padNum = number != null ? String(number).padStart(2, "0") : null;

  return (
    <section ref={ref} style={{ backgroundColor: bg }}>
      {/* Top bar with rule */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[240px]">
        <div className="flex items-center justify-between border-b border-[0.3px] border-[#4d4d4d] py-4 md:py-5">
          <motion.span
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#555] md:text-xs 3xl:text-sm 4xl:text-base 5xl:text-lg"
            style={{ fontFamily: "var(--font-ui)" }}
            initial={{ opacity: 0, x: -12 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {padNum ? `[${padNum}] ` : ""}{label}
          </motion.span>
          {totalItems && padNum && (
            <motion.span
              className="text-[11px] font-medium tracking-[0.08em] text-[#444] md:text-xs 3xl:text-sm 4xl:text-base 5xl:text-lg"
              style={{ fontFamily: "var(--font-ui)" }}
              initial={{ opacity: 0, x: 12 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            >
              / ITEM {number} : {totalItems}
            </motion.span>
          )}
        </div>
      </div>

      {/* Heading area */}
      <div className="mx-auto w-full px-6 pt-10 md:px-12 md:pt-16 lg:px-[240px] 3xl:pt-20 4xl:pt-24 5xl:pt-32">
        <motion.p
          className="max-w-[900px] font-display text-[24px] leading-[1.25] tracking-[-1px] md:text-[32px] lg:text-[40px] xl:text-[46px] 3xl:text-[56px] 4xl:text-[68px] 5xl:text-[90px]"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <span className="text-white">{heading}</span>
          {headingMuted && (
            <span className="text-[#666]"> {headingMuted}</span>
          )}
        </motion.p>
      </div>

      {/* Content area */}
      <div className="pb-16 pt-10 md:pb-[120px] md:pt-16 3xl:pb-[140px] 3xl:pt-20 4xl:pb-[160px] 4xl:pt-24 5xl:pb-[200px] 5xl:pt-32">
        {children}
      </div>
    </section>
  );
}
