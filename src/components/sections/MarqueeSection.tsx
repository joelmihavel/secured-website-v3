"use client";

import React from "react";
import { motion } from "framer-motion";
import { OpenSection } from "@/components/layout/OpenSection";

type MarqueeSectionProps = {
  topPrefixText?: string;
  topEmphasisText?: string;
  bottomPrefixText?: string;
  bottomEmphasisText?: string;
  repeatCount?: number;
  animationDuration?: number;
};

export const MARQUEE_DEFAULT_PROPS: MarqueeSectionProps = {
  topPrefixText: "We fixed Renting, it's called ",
  topEmphasisText: "Flenting",
  bottomPrefixText: "We build and run the ",
  bottomEmphasisText: "entire living experience.",
  repeatCount: 8,
  animationDuration: 180,
};

export const MarqueeSection = ({
  topPrefixText = MARQUEE_DEFAULT_PROPS.topPrefixText,
  topEmphasisText = MARQUEE_DEFAULT_PROPS.topEmphasisText,
  bottomPrefixText = MARQUEE_DEFAULT_PROPS.bottomPrefixText,
  bottomEmphasisText = MARQUEE_DEFAULT_PROPS.bottomEmphasisText,
  repeatCount = MARQUEE_DEFAULT_PROPS.repeatCount,
  animationDuration = MARQUEE_DEFAULT_PROPS.animationDuration,
}: MarqueeSectionProps) => {
  const topContent = (
    <>
      {[...Array(repeatCount)].map((_, i) => (
        <span key={i} className="text-xl sm:text-2xl md:text-4xl lg:text-fluid-h1 font-heading text-muted-foreground tracking-tight">
          {topPrefixText}
          <span className="font-zin-italic">{topEmphasisText}</span>
        </span>
      ))}
    </>
  );

  const bottomContent = (
    <>
      {[...Array(repeatCount)].map((_, i) => (
        <span key={i} className="text-xl sm:text-2xl md:text-4xl lg:text-fluid-h1 font-heading text-brand-yellow tracking-tight">
          {bottomPrefixText}
          <span className="font-zin-italic">{bottomEmphasisText}</span>
        </span>
      ))}
    </>
  );

  return (
    <OpenSection className="bg-bg-white py-0">
      <div className="relative flex flex-col gap-0">
        <div
          className="z-0 flex items-center overflow-hidden border border-border bg-pastel-brown/30"
          style={{
            transform: "skewY(1deg)",
            transformOrigin: "center",
          }}
        >
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: animationDuration, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap flex items-center space-x-12 py-8 shrink-0"
          >
            {topContent}
          </motion.div>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: animationDuration, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap flex items-center space-x-12 py-8 shrink-0"
          >
            {topContent}
          </motion.div>
        </div>

        <div
          className="relative z-10 -mt-4 flex items-center overflow-hidden border-2 border-brand-yellow bg-night-violet"
          style={{
            transform: "skewY(-1deg)",
            transformOrigin: "center",
          }}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: animationDuration, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap flex items-center space-x-12 py-8 pl-4 pr-8 shrink-0"
          >
            {bottomContent}
          </motion.div>
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: animationDuration, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap flex items-center space-x-12 py-4 md:py-8 pl-4 pr-8 shrink-0"
          >
            {bottomContent}
          </motion.div>
        </div>
      </div>
    </OpenSection>
  );
};
