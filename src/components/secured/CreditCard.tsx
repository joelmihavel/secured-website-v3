"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SlideUp } from "./ui/TextReveal";
import { Button } from "./ui/Button";
import { ICON_COMPONENTS } from "./AnimatedCardIcons";
import type { CreditCardContent } from "@/lib/secured/types";
import { downloadAppCta } from "@/lib/secured/cta";

function FeatureCard({
  text,
  iconKey,
  accentText,
  index,
}: {
  text: string;
  iconKey: string;
  accentText?: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = ICON_COMPONENTS[iconKey];

  return (
    <motion.div
      ref={ref}
      className="flex h-full flex-col gap-4 border-[0.3px] border-[#4d4d4d] p-5 md:p-6 lg:-ml-[0.3px] lg:-mt-[0.3px] lg:gap-[32px] lg:px-[64px] lg:py-[48px]"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="aspect-[4/3] w-full">
        {Icon && isInView && <Icon className="h-full w-full" />}
      </div>
      <div className="mt-auto text-center">
        {accentText && (
          <span
            className="text-[16px] font-normal leading-[24px] text-[#ff9a6d]"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {accentText}{" "}
          </span>
        )}
        <span
          className="text-[16px] font-normal leading-[24px] text-white"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {text}
        </span>
      </div>
    </motion.div>
  );
}

export function CreditCard({ data }: { data: CreditCardContent }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  const colCount = data.featureCards.length <= 3 ? 3 : 4;

  return (
    <section className="relative bg-[#131313]">
      {data.heading && <div className="h-[60px] md:h-[80px] lg:h-[120px]" />}

      {/* Text section — hidden when heading is empty */}
      {data.heading && (
        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div className="py-12 md:py-20 lg:px-[120px] lg:pb-[64px] lg:pt-[64px]">
            <div className="text-center">
              <motion.h2
                ref={headingRef}
                className="mx-auto max-w-[600px] text-[28px] leading-[1.3] tracking-[-1px] text-white md:text-[36px] lg:max-w-[715px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px]"
                style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
                initial={{ opacity: 0, y: 20 }}
                animate={headingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white">Yes, you can pay rent{"\n"}</span>
                <span className="text-[#ff9a6d]">using your credit card here</span>
              </motion.h2>

              <SlideUp delay={0.2} className="mt-3 lg:mt-[16px]">
                <p
                  className="text-base leading-[1.6] text-[#999] md:text-lg lg:text-[20px] lg:leading-[32px] lg:text-[#797979]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.subheading}
                </p>
              </SlideUp>
            </div>
          </div>
        </div>
      )}

      {/* Feature grid — 3 or 4 columns based on card count */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-0 ${colCount === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          {data.featureCards.map((card, i) => (
            <FeatureCard
              key={i}
              text={card.text}
              iconKey={card.iconKey}
              accentText={card.accentText}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* CTA — hidden when empty */}
      {data.ctaButtonText && (
        <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div className="lg:px-[120px]">
            <div className="mx-auto mt-10 max-w-[480px] text-center md:mt-16 lg:mx-0 lg:mt-[64px] lg:max-w-[480px] lg:text-left">
              <Button fullWidth onClick={downloadAppCta}>
                {data.ctaButtonText}
              </Button>
              {data.ctaDisclaimer && (
                <p
                  className="mt-3 text-center text-xs leading-[1.8] tracking-[-0.24px] text-[#aaa] lg:text-left"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.ctaDisclaimer}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
