"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./TopBanner.module.css";

const MARQUEE_PART_1 = "Recommend Flent in your network";
const MARQUEE_PART_2 = "Earn rewards upto 1 lakh";

const MarqueeSeparator = () => (
  <span className={styles["marquee-css__separator"]} aria-hidden="true">
    <svg
      className={styles["marquee-css__separator-svg"]}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  </span>
);

const MarqueeItem = () => (
  <div className={styles["marquee-css__item"]}>
    <p className={styles["marquee-css__item-p"]}>{MARQUEE_PART_1}</p>
    <MarqueeSeparator />
    <p className={styles["marquee-css__item-p"]}>{MARQUEE_PART_2}</p>
    <MarqueeSeparator />
  </div>
);

export const TopBanner = () => {
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef1 = useRef<HTMLDivElement>(null);
  const listRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on specific pages
    const allowedPaths = ["/", "/homes", "/about", "/owners"];
    setShouldRender(allowedPaths.includes(pathname));
  }, [pathname]);

  useEffect(() => {
    if (!shouldRender) return;

    const pixelsPerSecond = 75;
    const container = containerRef.current;
    const lists = [listRef1.current, listRef2.current];

    if (!container) return;

    // Measure height and update global variable for layout adjustments
    const updateHeight = () => {
        const height = container.offsetHeight;
        document.documentElement.style.setProperty('--top-banner-height', `${height}px`);
    };
    
    // Initial height set
    updateHeight();

    if (!lists[0] || !lists[1]) return;

    // Calculate duration based on width of the first list (assuming equal)
    const updateDuration = () => {
      if (lists[0]) {
        const width = lists[0].offsetWidth;
        const duration = width / pixelsPerSecond;
        lists.forEach((list) => {
          if (list) {
            list.style.animationDuration = `${duration}s`;
          }
        });
      }
    };

    // Initial calculation
    updateDuration();

    // Resize observer to recalculate if width changes
    const resizeObserver = new ResizeObserver(() => {
        updateDuration();
        updateHeight();
    });
    if (lists[0]) resizeObserver.observe(lists[0]);
    resizeObserver.observe(container);


    // Intersection Observer for play/pause
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          lists.forEach((list) => {
            if (list) {
              list.style.animationPlayState = isIntersecting
                ? "running"
                : "paused";
            }
          });
        });
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => {
      document.documentElement.style.removeProperty('--top-banner-height');
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <Link href="/tastemakers" className="block w-full">
      <div
        ref={containerRef}
        data-css-marquee=""
        className={styles["marquee-css"]}
      >
        <div
          ref={listRef1}
          data-css-marquee-list=""
          className={`${styles["marquee-css__list"]} ${styles["animate-marquee"]}`}
        >
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
        </div>
        <div
          ref={listRef2}
          data-css-marquee-list=""
          className={`${styles["marquee-css__list"]} ${styles["animate-marquee"]}`}
          aria-hidden="true"
        >
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
        </div>
      </div>
    </Link>
  );
};
