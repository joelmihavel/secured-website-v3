"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SlideUp } from "./ui/TextReveal";
import type { TrustContent } from "@/lib/secured/types";

function TrustPoint({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
    >
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#ff9a6d" />
          <motion.path
            d="M6 10.5L8.5 13L14 7.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
          />
        </svg>
      </div>
      <span
        className="text-[14px] leading-[1.8] tracking-[-0.32px] text-white md:text-[16px]"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {text}
      </span>
    </motion.div>
  );
}

export function TrustSection({ data, variant = "tenant" }: { data: TrustContent; variant?: "tenant" | "landlord" }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  if (variant === "landlord") {
    const parts = data.heading.split(/(one event away from disruption)/i);
    return (
      <section className="relative bg-[#131313]">
        <div className="h-[100px]" />

        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div className="py-12 md:py-16 lg:px-[120px] lg:pb-[48px] lg:pt-[64px]">
            <div className="text-center">
              <SlideUp>
                <p
                  className="text-sm leading-[1.6] tracking-[0.3em] uppercase text-[#797979] md:text-base"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  You invested crores into that home
                </p>
              </SlideUp>
              <motion.h2
                ref={headingRef}
                className="mx-auto mt-4 max-w-[850px] text-[28px] leading-[1.3] tracking-[-0.5px] text-white md:text-[36px] lg:text-[40px] lg:leading-[1.4] lg:tracking-[-0.88px]"
                style={{ fontFamily: "var(--font-ui)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={headingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                {parts.map((part, i) =>
                  /one event away from disruption/i.test(part) ? (
                    <span key={i}><br className="hidden md:block" /><span className="text-[#ff9a6d]">{part}</span></span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </motion.h2>

              <SlideUp delay={0.2} className="mt-4 lg:mt-[16px]">
                <p
                  className="mx-auto max-w-[700px] text-base leading-[1.6] text-[#797979] md:text-lg lg:text-[20px] lg:leading-[32px]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.description}
                </p>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const headingParts = data.heading.split(/(INR 20\+ crores)/i);

  return (
    <section className="relative bg-[#131313]">
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="py-12 md:py-20 lg:pt-[152px] lg:pb-[64px]">
          <div className="lg:px-[120px]">
            <div className="flex flex-col items-center gap-3 text-center lg:gap-[12px]">
              <motion.h2
                ref={headingRef}
                className="text-[32px] leading-[1.2] tracking-[-1px] text-white md:text-[40px] lg:text-[48px] lg:leading-[64px] lg:tracking-[-2px]"
                style={{ fontFamily: "var(--font-ui)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={headingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                {headingParts.map((part, i) =>
                  /INR 20\+ crores/i.test(part) ? (
                    <span key={i} className="text-[#ff9a6d]">{part}</span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </motion.h2>

              <SlideUp delay={0.1}>
                <p
                  className="text-[20px] leading-[1.4] tracking-[-0.5px] text-[#A6A6A6] md:text-[24px] lg:text-[28px] lg:leading-[40px] lg:tracking-[-1px]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.description}
                </p>
              </SlideUp>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
