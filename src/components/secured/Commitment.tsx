"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SlideUp } from "./ui/TextReveal";
import { ICON_COMPONENTS } from "./AnimatedCardIcons";
import type { CommitmentContent } from "@/lib/secured/types";

function BenefitCard({
  text,
  iconKey,
  accentText,
  index,
  colSpan = 2,
  tag,
}: {
  text: string;
  iconKey: string;
  accentText?: string;
  index: number;
  colSpan?: number;
  tag?: "live" | "coming-soon";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const Icon = ICON_COMPONENTS[iconKey];

  const spanClass = colSpan === 1 ? "lg:col-span-1" : colSpan === 3 ? "lg:col-span-3" : "lg:col-span-2";

  return (
    <motion.div
      ref={ref}
      className={`relative flex flex-col gap-4 border-[0.3px] border-[#4d4d4d] p-5 md:p-6 lg:-ml-[0.3px] lg:-mt-[0.3px] lg:gap-4 lg:px-[40px] lg:py-[48px] ${spanClass}`}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {tag && (
        <div className="absolute right-4 top-4 lg:right-6 lg:top-6">
          {tag === "live" ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-[#4CAF50]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4CAF50]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4CAF50] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
              </span>
              Live now
            </span>
          ) : (
            <span
              className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#797979]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Coming soon
            </span>
          )}
        </div>
      )}
      <div className="aspect-[4/3] w-full">
        {Icon && isInView && <Icon className="h-full w-full" />}
      </div>
      <div className="text-center">
        {accentText && (
          <span
            className="text-[18px] font-normal leading-[32px] text-[#ff9a6d] md:text-[20px]"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {accentText}{" "}
          </span>
        )}
        <span
          className="text-[18px] font-normal leading-[32px] text-white md:text-[20px]"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {text}
        </span>
      </div>
    </motion.div>
  );
}

export function Commitment({
  data,
  variant = "tenant",
}: {
  data: CommitmentContent;
  variant?: "tenant" | "landlord";
}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: false, margin: "-60px" });

  return (
    <section className="relative bg-[#131313]">
      {/* Text section */}
      {(data.subtitle || data.heading || data.description) && (
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className={`py-12 md:py-20 lg:px-[120px] lg:pb-[64px] ${variant === "landlord" ? "lg:pt-[48px]" : "lg:pt-[160px]"}`}>
          <div className={`${variant === "landlord" ? "text-center" : "text-center lg:text-left"}`}>
            {data.subtitle && (
              <SlideUp>
                <p
                  className="text-sm leading-[1.6] tracking-[-0.32px] text-[#a6a6a6] md:text-base lg:text-[16px] lg:uppercase lg:tracking-[0.309px]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.subtitle}
                </p>
              </SlideUp>
            )}

            {(variant === "tenant" || data.heading) && (
              <motion.h2
                ref={headingRef}
                className="mx-auto mt-3 max-w-[750px] text-[28px] leading-[1.3] tracking-[-1px] text-white md:mt-4 md:text-[36px] lg:mx-0 lg:max-w-[715px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px]"
                style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
                initial={{ opacity: 0, y: 20 }}
                animate={headingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {variant === "tenant" ? (
                  <>
                    <span className="text-white">You&apos;ve </span>
                    <span className="text-[#ff9a6d]">handled it responsibly</span>
                    <span className="text-white">,{"\n"}but it&apos;s never really led to anything</span>
                  </>
                ) : (
                  data.heading
                )}
              </motion.h2>
            )}

            {data.description && (
              <SlideUp delay={0.3} className="mt-4 lg:mt-[16px]">
                <p
                  className="mx-auto max-w-[700px] text-base leading-[1.7] text-[#888] md:text-lg lg:mx-0 lg:max-w-none lg:text-[20px] lg:leading-[32px] lg:text-[#797979]"
                  style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
                >
                  {data.description}
                </p>
              </SlideUp>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Benefit grid — 3 top, 2 bottom filling row */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${variant === "landlord" ? "lg:grid-cols-4" : "lg:grid-cols-6"} lg:gap-0`}>
          {data.benefitCards.map((card, i) => {
            const total = data.benefitCards.length;
            let span = 2;
            if (variant === "landlord") {
              span = 1;
            } else if (total === 4) {
              span = 3;
            } else {
              const remainder = total % 3;
              const lastRowStart = total - remainder;
              const isLastRow = remainder > 0 && i >= lastRowStart;
              span = isLastRow ? 6 / remainder : 2;
            }
            return (
              <BenefitCard
                key={i}
                text={card.text}
                iconKey={card.iconKey}
                accentText={card.accentText}
                tag={card.tag}
                index={i}
                colSpan={span}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
