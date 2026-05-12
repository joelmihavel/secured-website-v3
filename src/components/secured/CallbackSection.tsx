"use client";

import { SectionWrapper } from "./ui/SectionWrapper";
import { FadeIn } from "./ui/FadeIn";
import { Button } from "./ui/Button";
import { WordReveal, SlideUp } from "./ui/TextReveal";
import type { CallbackContent } from "@/lib/secured/types";

export function CallbackSection({ data }: { data: CallbackContent }) {
  return (
    <section className="relative bg-[#131313] py-12 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,154,109,0.3) 0%, transparent 60%)",
        }}
      />

      <SectionWrapper className="relative z-10">
        <div className="mx-auto max-w-[600px] text-center md:max-w-[700px] xl:max-w-[800px] 3xl:max-w-[1000px] 4xl:max-w-[1300px] 5xl:max-w-[1800px]">
          <h2 className="font-display text-[28px] leading-[1.3] tracking-[-0.5px] text-white md:text-[34px] lg:text-[40px] xl:text-[48px] 3xl:text-[60px] 4xl:text-[72px] 5xl:text-[96px]">
            <WordReveal>{data.heading}</WordReveal>
          </h2>

          <SlideUp delay={0.2} className="mt-4 md:mt-6">
            <p
              className="text-base leading-[1.7] text-[#999] md:text-lg 3xl:text-xl 4xl:text-2xl 5xl:text-3xl"
              style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
            >
              {data.description}
            </p>
          </SlideUp>

          <FadeIn delay={0.4} className="mt-8 md:mt-10">
            <div className="mx-auto max-w-[320px] 3xl:max-w-[400px] 4xl:max-w-[500px] 5xl:max-w-[680px]">
              <Button
                fullWidth
                href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.ctaButtonText}
              </Button>
            </div>
          </FadeIn>
        </div>
      </SectionWrapper>
    </section>
  );
}
