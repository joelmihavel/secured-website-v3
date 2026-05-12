"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { FooterContent } from "@/lib/secured/types";
import { buildWhatsAppApiLink } from "@/lib/whatsapp";
import { DotGrid } from "./ui/DotGrid";
import { GlitchImage } from "./ui/GlitchImage";

export function Footer({ data }: { data: FooterContent }) {
  return (
    <footer className="relative overflow-hidden bg-[#131313]">
      {/* Glitch illustration */}
      <div className="relative mx-auto w-full lg:px-[120px]">
        <GlitchImage src="/assets/figma/roman-illustration.webp" />
      </div>

      {/* CTA section — heading left, buttons right */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="py-12 md:py-16 lg:px-[120px] lg:py-[64px]">
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:gap-[32px] md:text-left">
            {/* Left — heading */}
            <motion.h2
              className="text-[28px] leading-[1.3] tracking-[-0.5px] md:text-[36px] lg:max-w-[715px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px]"
              style={{ fontFamily: "var(--font-ui)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white">{data.taglineLine1} </span>
              <span className="text-[#ff9a6d]">{data.taglineLine2}</span>
            </motion.h2>

            {/* Right — action buttons */}
            <motion.div
              className="flex w-full flex-col gap-1 md:w-[320px] md:flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <a
                href="https://www.flent.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-[12px] bg-[#202020] px-6 py-4 text-[14px] leading-[20px] text-white transition-colors hover:bg-[#282828]"
                style={{
                  fontFamily: "var(--font-body)",
                  boxShadow:
                    "0px 78px 23.5px rgba(0,0,0,0.05), 0px 35px 17.5px rgba(0,0,0,0.09), 0px 9px 9.5px rgba(0,0,0,0.1)",
                }}
              >
                Explore Flent
              </a>
              <a
                href={buildWhatsAppApiLink(
                  "Curious to know more about Flent—tell me everything! [WAX-UK6N]"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-[12px] bg-[#202020] px-6 py-4 text-[14px] leading-[20px] text-white transition-colors hover:bg-[#282828]"
                style={{
                  fontFamily: "var(--font-body)",
                  boxShadow:
                    "0px 78px 23.5px rgba(0,0,0,0.05), 0px 35px 17.5px rgba(0,0,0,0.09), 0px 9px 9.5px rgba(0,0,0,0.1)",
                }}
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="lg:px-[120px]">
          <div className="flex flex-col items-center justify-between gap-3 py-8 md:flex-row lg:py-[64px]">
            {/* Left — Secured by flent */}
            <div className="flex items-center gap-2">
              <span
                className="text-[18px] leading-[1.2] tracking-[-0.5px] text-[#ff9a6d] md:text-[23.8px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Secured
              </span>
              <span
                className="text-[16px] font-light leading-[1.2] tracking-[-0.8px] text-white md:text-[22.4px]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                by
              </span>
              <Image
                src="/assets/icons/flent-wordmark-white.svg"
                alt="flent"
                width={50}
                height={18}
                className="h-[14px] w-auto md:h-[18px]"
              />
            </div>

            {/* Right — copyright */}
            <p
              className="text-xs uppercase text-[#bababa] md:text-[14px] md:leading-[20px]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {data.copyright}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom dot grid — fading out downward */}
      <DotGrid />
    </footer>
  );
}
