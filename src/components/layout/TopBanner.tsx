"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./TopBanner.module.css";

const MARQUEE_TEXT =
  "Recommend Flent in your network • Earn rewards upto 1 lakh • Unlock Bangalore's best brands";

const MarqueeItem = () => (
  <div className={styles["marquee-css__item"]}>
    <p className={styles["marquee-css__item-p"]}>{MARQUEE_TEXT}</p>
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
