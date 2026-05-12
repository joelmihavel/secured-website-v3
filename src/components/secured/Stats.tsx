"use client";

import { SlideUp } from "./ui/TextReveal";
import { FadeIn } from "./ui/FadeIn";
import type { StatsContent } from "@/lib/secured/types";

export function Stats({ data }: { data: StatsContent }) {
  return (
    <section className="bg-[#131313]">
      {/* Stats content */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="py-12 md:py-20 lg:px-[120px] lg:py-[80px]">
          <div className="flex flex-col gap-8 lg:gap-[40px]">
            {/* Eyebrow + heading */}
            <div className="flex flex-col gap-3 text-center lg:gap-[16px]">
              <SlideUp>
                <p
                  className="text-sm leading-[1.6] text-[#797979] md:text-base lg:text-[20px] lg:leading-[32px]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.brandSubheading}
                </p>
              </SlideUp>
              <h2
                className="text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:text-[36px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <span className="text-white">Built </span>
                <span className="text-[#ff9a6d]">with </span>
                <span className="text-[#ff9a6d]">🧡</span>
                <span className="text-white"> by flent</span>
              </h2>
            </div>

            {/* Divider */}
            <div style={{ height: "0.3px", backgroundColor: "#4D4D4D" }} />

            {/* Stats row — horizontal on desktop, stacked on mobile */}
            <FadeIn delay={0.2}>
              <div className="flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center md:gap-10 lg:gap-[64px]">
                {data.stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {/* Check icon */}
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff9a6d]">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7L5.5 10L11.5 4" stroke="#131313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Stat text */}
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-[16px] font-medium leading-[1.4] text-[#ff9a6d] md:text-[18px]"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {stat.prefix && <>{stat.prefix}</>}
                        {stat.value}
                        {stat.separator && <>{stat.separator}</>}
                        {stat.suffix && <>{stat.suffix}</>}
                      </span>
                      <span
                        className="text-[14px] leading-[1.4] text-[#797979] md:text-[16px]"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Bottom divider */}
            <div style={{ height: "0.3px", backgroundColor: "#4D4D4D" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
