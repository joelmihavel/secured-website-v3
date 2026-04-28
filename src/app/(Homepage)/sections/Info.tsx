"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { OpenSection } from "@/components/layout/OpenSection";

export interface InfoStat {
  value: string;
  label: string;
  color?: string;
  bgColor?: string;
  rotation?: number;
}

const defaultStats: InfoStat[] = [
  {
    value: "10%",
    label: "Homes qualify our evaluation criteria",
    color: "text-text-invert",
    bgColor: "bg-brick-red",
    rotation: -2,
  },
  {
    value: "58",
    label:
      "Quality checks across utilities and safety",
    color: "text-text-invert",
    bgColor: "bg-forest-green",
    rotation: 3,
  },
  {
    value: "₹5L",
    label: "Avg. invested in design, furnishings & setup per home.",
    color: "text-text-invert",
    bgColor: "bg-ground-brown",
    rotation: -1,
  },
];

const defaultHeading = (
  <>
    A lot goes in <br className="hidden md:block" />
    before you walk <br className="hidden md:block" />
    into <span className="font-zin-italic">that home</span>
  </>
);

interface InfoProps {
  heading?: React.ReactNode;
  stats?: InfoStat[];
  showVideo?: boolean;
  topContent?: React.ReactNode;
  topClassName?: string;
  numberClassName?: string;
  showTopTear?: boolean;
  showHeading?: boolean;
  hideHeadingOnMobile?: boolean;
  showStats?: boolean;
  rightColumn?: React.ReactNode;
  contentContainerClassName?: string;
}

// CountUp component for animating numbers
interface CountUpProps {
  end: string;
  color: string;
  duration?: number;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  color,
  duration = 2,
  className,
}) => {
  const [count, setCount] = useState<string>("");
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric value from the string
    const numericMatch = end.match(/[\d,]+/);
    if (!numericMatch) return;

    const numericStr = numericMatch[0].replace(/,/g, "");
    const targetValue = parseInt(numericStr, 10);

    // Extract prefix, suffix, and format
    const prefix = end.substring(0, end.indexOf(numericMatch[0]));
    const suffix = end.substring(
      end.indexOf(numericMatch[0]) + numericMatch[0].length
    );
    const hasCommas = numericMatch[0].includes(",");

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * targetValue);

      // Format with commas if original had them
      let formattedValue = currentValue.toString();
      if (hasCommas) {
        formattedValue = currentValue.toLocaleString("en-IN");
      }

      setCount(prefix + formattedValue + suffix);

      if (now < endTime) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animate();
  }, [isInView, end, duration]);

  return (
    <p
      ref={ref}
      className={`font-zin font-extrabold ${className ?? "text-fluid-h1"} ${color}`}
    >
      {count || end}
    </p>
  );
};

export const Info = ({
  heading,
  stats,
  showVideo = true,
  topContent,
  topClassName,
  numberClassName,
  showTopTear = true,
  showHeading,
  hideHeadingOnMobile = false,
  showStats,
  rightColumn,
  contentContainerClassName,
}: InfoProps) => {
  const displayHeading = heading ?? defaultHeading;
  const displayStats = stats ?? defaultStats;
  const shouldShowHeading = showHeading ?? true;
  const shouldShowStats = showStats ?? true;
  const hasCustomTop = Boolean(topContent);
  const shouldShowTop = hasCustomTop || showVideo;
  const shouldShowVideo = showVideo && !hasCustomTop;
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoContainerRef, { margin: "0px" });

  useEffect(() => {
    if (!shouldShowVideo) return;
    if (isInView) {
      desktopVideoRef.current?.play().catch(() => {});
      mobileVideoRef.current?.play().catch(() => {});
    } else {
      desktopVideoRef.current?.pause();
      mobileVideoRef.current?.pause();
    }
  }, [isInView, shouldShowVideo]);

  return (
    <OpenSection className="bg-bg-white">
      {/* Top media/content (Edge to Edge) */}
      {shouldShowTop && (
      <div
        ref={videoContainerRef}
        className={`w-full overflow-hidden flex items-center justify-center relative ${
          shouldShowVideo ? "bg-bg-white md:aspect-[2.5/1] aspect-video" : `py-12 md:py-16 ${topClassName ?? "bg-bg-white"}`
        }`}
      >
        {/* Torn Paper Edge - Top */}
        {showTopTear && (
          <div className="absolute top-0 left-0 w-full h-8 md:h-16 z-20 -translate-y-2 pointer-events-none">
            <svg className="w-full h-full text-bg-white fill-current">
              <defs>
                <filter
                  id="paper-tear-top"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.012"
                    numOctaves="3"
                    seed="42"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="12"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              <rect
                x="-10%"
                y="0"
                width="120%"
                height="18"
                filter="url(#paper-tear-top)"
                className="md:hidden"
              />
              <rect
                x="-10%"
                y="0"
                width="120%"
                height="36"
                filter="url(#paper-tear-top)"
                className="hidden md:block"
              />
            </svg>
          </div>
        )}

        {shouldShowVideo ? (
          <>
            {/* desktop */}
            <video
              ref={desktopVideoRef}
              src="https://video.gumlet.io/6937b930eed47e91a76c4acd/69419d7f9c03c66ee7ce9353/download.mp4"
              className="object-cover w-full h-full hidden md:block"
              muted
              loop
              playsInline
            />
            {/* mobile */}
            <video
              ref={mobileVideoRef}
              src="https://video.gumlet.io/6937b930eed47e91a76c4acd/69419d98616d7c8c6a7b5465/download.mp4"
              className="object-cover w-full h-full block md:hidden"
              muted
              loop
              playsInline
            />
          </>
        ) : (
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">{topContent}</div>
        )}

        {/* Torn Paper Edge */}
        <div className="absolute bottom-0 left-0 w-full h-8 md:h-16 z-20 translate-y-2 pointer-events-none">
          <svg className="w-full h-full text-bg-white fill-current">
            <defs>
              <filter
                id="paper-tear"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012"
                  numOctaves="3"
                  seed="1"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="12"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
            <rect
              x="-10%"
              y="14"
              width="120%"
              height="100%"
              filter="url(#paper-tear)"
              className="md:hidden"
            />
            <rect
              x="-10%"
              y="28"
              width="120%"
              height="100%"
              filter="url(#paper-tear)"
              className="hidden md:block"
            />
          </svg>
        </div>
      </div>
      )}

      <div className={contentContainerClassName ?? "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Heading */}
          {shouldShowHeading && (
            <div
              className={`lg:col-span-5 text-center lg:text-left ${
                hideHeadingOnMobile ? "hidden md:block" : ""
              }`}
            >
              <h2 className="font-heading text-fluid-h2 font-bold leading-tight tracking-tight text-text-main">
                {displayHeading}
              </h2>
            </div>
          )}

          {/* Stats */}
          <div className="lg:col-span-7">
            {rightColumn ??
              (shouldShowStats && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
                  {displayStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 20,
                        rotate: stat.rotation ?? 0,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        rotate: stat.rotation ?? 0,
                      }}
                      whileHover={{ scale: 1.05, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className={`flex flex-col gap-4 items-center justify-center text-center ${
                        stat.bgColor ?? "bg-ground-brown"
                      } rounded-3xl p-8 shadow-lg aspect-[2/1] md:aspect-auto ${
                        index === 2
                          ? "col-span-2 md:col-span-1 mx-auto max-w-md md:max-w-none"
                          : ""
                      }`}
                    >
                      <CountUp
                        end={stat.value}
                        color={stat.color ?? "text-text-invert"}
                        duration={2.5}
                        className={numberClassName}
                      />
                      <p className="text-sm text-text-invert/80 font-heading leading-relaxed line-clamp-none sm:line-clamp-3">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </OpenSection>
  );
};
