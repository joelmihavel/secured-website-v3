"use client";

import { SlideUp } from "./ui/TextReveal";
import { AsciiBackground } from "./AsciiBackground";
import type { DownloadAppContent } from "@/lib/secured/types";

export function DownloadApp({ data }: { data: DownloadAppContent }) {
  return (
    <section id="download-app" className="bg-[#131313]">
      <div className="h-[60px] md:h-[80px] lg:h-[120px]" />

      {/* Content: QR left, text + buttons right */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="lg:px-[120px]">
          {/* Mobile: stacked centered */}
          <div className="flex flex-col items-center gap-6 text-center lg:hidden">
            <div className="flex h-[180px] w-[180px] flex-shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#1a1a1a]">
              <img
                src="/assets/logos/qr-code.svg"
                alt="Download QR code"
                className="h-[160px] w-[160px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2
                className="text-[28px] leading-[1.3] tracking-[-0.5px] text-white md:text-[36px]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {data.heading}{" "}
                {data.headingHighlight && (
                  <span className="text-[#ff9a6d]">{data.headingHighlight}</span>
                )}
              </h2>
              <SlideUp delay={0.2}>
                <p
                  className="text-base leading-[1.7] text-[#797979] md:text-lg"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.description}
                </p>
              </SlideUp>
            </div>
            <div className="flex w-full flex-col gap-3">
              <a
                href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-full bg-[#ff9a6d] px-7 py-4 transition-all duration-200 hover:bg-[#ffb08a]"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="#131313">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span
                  className="text-[13px] font-semibold text-[#131313] md:text-sm"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.appStoreButtonText}
                </span>
              </a>
              <div className="flex items-center justify-center gap-2.5 rounded-full border border-white/[0.12] px-7 py-4">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="#555">
                  <path d="M17.523 2.235a.5.5 0 0 0-.86.508l1.139 1.934A7.98 7.98 0 0 0 12 2.984a7.98 7.98 0 0 0-5.802 1.693L7.337 2.743a.5.5 0 0 0-.86-.508L5.163 4.59A8.46 8.46 0 0 0 3.5 10.5h17A8.46 8.46 0 0 0 18.837 4.59l-1.314-2.355zM8.5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3.5 11.5v7A1.5 1.5 0 0 0 5 20h1v2.5a1.5 1.5 0 0 0 3 0V20h6v2.5a1.5 1.5 0 0 0 3 0V20h1a1.5 1.5 0 0 0 1.5-1.5v-7h-17zM1 11.5a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5zm19 0a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5z" />
                </svg>
                <span
                  className="text-sm font-medium text-[#555]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Coming soon for Android
                </span>
              </div>
            </div>
          </div>

          {/* Desktop: QR left, text + buttons right */}
          <div className="hidden items-center gap-[80px] lg:flex">
            <div className="flex h-[240px] w-[240px] flex-shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#1a1a1a]">
              <img
                src="/assets/logos/qr-code.svg"
                alt="Download QR code"
                className="h-[220px] w-[220px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div className="flex flex-1 flex-col gap-[48px]">
              <div className="flex flex-col gap-[16px]">
                <h2
                  className="text-[40px] leading-[1.3] tracking-[-0.88px] text-white"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.heading}{" "}
                  {data.headingHighlight && (
                    <span className="text-[#ff9a6d]">{data.headingHighlight}</span>
                  )}
                </h2>
                <SlideUp delay={0.2}>
                  <p
                    className="text-[20px] leading-[32px] text-[#797979]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {data.description}
                  </p>
                </SlideUp>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-full bg-[#ff9a6d] px-7 py-[18px] transition-all duration-200 hover:bg-[#ffb08a]"
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="#131313">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span
                    className="text-sm font-semibold text-[#131313]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {data.appStoreButtonText}
                  </span>
                </a>
                <div className="flex items-center justify-center gap-2.5 rounded-full border border-white/[0.12] px-7 py-[18px]">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="#555">
                    <path d="M17.523 2.235a.5.5 0 0 0-.86.508l1.139 1.934A7.98 7.98 0 0 0 12 2.984a7.98 7.98 0 0 0-5.802 1.693L7.337 2.743a.5.5 0 0 0-.86-.508L5.163 4.59A8.46 8.46 0 0 0 3.5 10.5h17A8.46 8.46 0 0 0 18.837 4.59l-1.314-2.355zM8.5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3.5 11.5v7A1.5 1.5 0 0 0 5 20h1v2.5a1.5 1.5 0 0 0 3 0V20h6v2.5a1.5 1.5 0 0 0 3 0V20h1a1.5 1.5 0 0 0 1.5-1.5v-7h-17zM1 11.5a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5zm19 0a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5z" />
                  </svg>
                  <span
                    className="text-sm font-medium text-[#555]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Coming soon for Android
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ASCII art animation below */}
      <div className="mt-[48px] lg:mt-[80px]">
        <div className="relative mx-auto w-full px-6 md:px-12 lg:px-[120px]">
          <div
            className="relative overflow-hidden border-[0.3px] border-[#4d4d4d]"
            style={{ background: "linear-gradient(180deg, #141414 0%, #121212 100%)" }}
          >
            <div className="pointer-events-none relative h-[300px] opacity-[0.22] md:h-[400px]" aria-hidden="true">
              <AsciiBackground
                imageSrc="/assets/backgrounds/apartment-building-hires.jpg"
                fontSize={6}
                brightnessBoost={2.8}
                parallaxStrength={0.2}
                scale={1}
              />
              {/* Scanlines */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 1px, rgba(0,0,0,0.25) 1px, rgba(0,0,0,0.25) 3px)",
                  pointerEvents: "none",
                }}
              />
              {/* Chromatic aberration layers */}
              <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                  background: "inherit",
                  transform: "translate(3px, -1px)",
                  opacity: 0.3,
                  filter: "hue-rotate(90deg)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                  background: "inherit",
                  transform: "translate(-3px, 1px)",
                  opacity: 0.25,
                  filter: "hue-rotate(-90deg)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
