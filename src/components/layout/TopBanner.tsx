"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./TopBanner.module.css";

const MarqueeItem = () => (
  <div className={styles["marquee-css__item"]}>
    <p className={styles["marquee-css__item-p"]}>Recommend Flent in your network</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor" className={styles["marquee-css__item-svg"]}>
      <path d="M17.6777 32.3223C12.9893 27.6339 6.63041 25 0 25C6.63041 25 12.9893 22.3661 17.6777 17.6777C22.3661 12.9893 25 6.63041 25 0C25 6.63041 27.6339 12.9893 32.3223 17.6777C37.0107 22.3661 43.3696 25 50 25C43.3696 25 37.0107 27.6339 32.3223 32.3223C27.6339 37.0107 25 43.3696 25 50C25 43.3696 22.3661 37.0107 17.6777 32.3223Z" fill="currentColor" />
    </svg>
    <p className={styles["marquee-css__item-p"]}>Earn rewards upto 1 lakh</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor" className={styles["marquee-css__item-svg"]}>
      <path d="M17.6777 32.3223C12.9893 27.6339 6.63041 25 0 25C6.63041 25 12.9893 22.3661 17.6777 17.6777C22.3661 12.9893 25 6.63041 25 0C25 6.63041 27.6339 12.9893 32.3223 17.6777C37.0107 22.3661 43.3696 25 50 25C43.3696 25 37.0107 27.6339 32.3223 32.3223C27.6339 37.0107 25 43.3696 25 50C25 43.3696 22.3661 37.0107 17.6777 32.3223Z" fill="currentColor" />
    </svg>
    {/* Added Text and Separator SVG below */}
    <p className={styles["marquee-css__item-p"]}>Unlock Bangalore’s best brands</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor" className={styles["marquee-css__item-svg"]}>
      <path d="M17.6777 32.3223C12.9893 27.6339 6.63041 25 0 25C6.63041 25 12.9893 22.3661 17.6777 17.6777C22.3661 12.9893 25 6.63041 25 0C25 6.63041 27.6339 12.9893 32.3223 17.6777C37.0107 22.3661 43.3696 25 50 25C43.3696 25 37.0107 27.6339 32.3223 32.3223C27.6339 37.0107 25 43.3696 25 50C25 43.3696 22.3661 37.0107 17.6777 32.3223Z" fill="currentColor" />
    </svg>
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
    <Link href="/secured" className="block w-full">
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
