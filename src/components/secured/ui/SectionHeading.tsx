"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WordReveal, SlideUp } from "./TextReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  description?: string;
  align?: "center" | "left";
  headingMaxWidth?: string;
  accentHeading?: boolean;
}

function EyebrowLabel({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        className="flex items-center gap-3 3xl:gap-4 4xl:gap-5"
        initial={{ y: "100%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="h-px w-5 bg-[#ff9a6d]/40 3xl:w-6 4xl:w-8 5xl:w-10" />
        <span
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#666] md:text-[11px] 3xl:text-xs 4xl:text-sm 5xl:text-base"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  description,
  align = "center",
  headingMaxWidth,
  accentHeading = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const headingMw = headingMaxWidth ?? (align === "center" ? "max-w-[900px] xl:max-w-[1000px] 3xl:max-w-[1200px] 4xl:max-w-[1500px] 5xl:max-w-[2000px]" : "");

  return (
    <div className={`flex flex-col ${alignClass}`}>
      {eyebrow && (
        <div className="mb-4 md:mb-5">
          <EyebrowLabel text={eyebrow} />
        </div>
      )}

      {/* Heading — matches Hero h1 scale */}
      <h2
        className={`${align === "center" ? "mx-auto" : ""} ${headingMw} font-display text-[36px] leading-[1] tracking-[-2px] md:text-[48px] lg:text-[64px] 3xl:text-[80px] 4xl:text-[96px] 5xl:text-[128px] ${
          accentHeading ? "text-[#ff9a6d]" : "text-white"
        }`}
      >
        <WordReveal delay={eyebrow ? 0.1 : 0}>{heading}</WordReveal>
      </h2>

      {/* Subheading — matches Hero subheading: font-ui, #999, tracking-[-1px] */}
      {subheading && (
        <SlideUp delay={eyebrow ? 0.25 : 0.15} className="mt-3">
          <p
            className={`${align === "center" ? "mx-auto" : ""} text-[18px] leading-[1.4] tracking-[-1px] text-[#999] md:text-[24px] lg:text-[28px] 3xl:text-[34px] 4xl:text-[42px] 5xl:text-[56px]`}
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {subheading.replace(/\n+/g, " ")}
          </p>
        </SlideUp>
      )}

      {/* Description — matches Hero description: font-ui, #888, smaller */}
      {description && (
        <SlideUp delay={eyebrow ? 0.35 : 0.25} className="mt-6">
          <p
            className={`${align === "center" ? "mx-auto" : ""} max-w-[420px] text-[15px] leading-[1.8] text-[#888] md:text-base 3xl:max-w-[520px] 3xl:text-lg 4xl:max-w-[680px] 4xl:text-xl 5xl:max-w-[900px] 5xl:text-2xl`}
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {description.replace(/\n+/g, " ")}
          </p>
        </SlideUp>
      )}
    </div>
  );
}
