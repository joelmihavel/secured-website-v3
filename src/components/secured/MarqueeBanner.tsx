"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const REPEAT = 10;

function MarqueeStrip({
  text,
  rotate,
  bg,
  textColor,
  direction,
  scrollYProgress,
}: {
  text: string;
  rotate: string;
  bg: string;
  textColor: string;
  direction: "left" | "right";
  scrollYProgress: import("framer-motion").MotionValue<number>;
}) {
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? ["0%", "-25%"] : ["-25%", "0%"]
  );

  return (
    <div
      className="w-[200vw] overflow-hidden py-2.5 md:py-3"
      style={{ transform: `rotate(${rotate})`, backgroundColor: bg }}
    >
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {Array.from({ length: REPEAT }).map((_, i) => (
          <span
            key={i}
            className="mx-5 text-[12px] font-bold tracking-[0.02em] md:mx-7 md:text-[13px] 3xl:text-sm 4xl:text-base 5xl:text-lg"
            style={{ fontFamily: "var(--font-ui)", color: textColor }}
          >
            {text}
            <span className="mx-5 opacity-40 md:mx-7">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function MarqueeBanner({
  text1,
  text2,
}: {
  text1: string;
  text2: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      className="relative z-[1000] flex flex-col items-center overflow-hidden"
    >
      <MarqueeStrip
        text={text1}
        rotate="0.22deg"
        bg="#1a1a1a"
        textColor="#999999"
        direction="left"
        scrollYProgress={scrollYProgress}
      />
      <MarqueeStrip
        text={text2}
        rotate="-0.48deg"
        bg="#cc7b57"
        textColor="#131313"
        direction="right"
        scrollYProgress={scrollYProgress}
      />
    </div>
  );
}
