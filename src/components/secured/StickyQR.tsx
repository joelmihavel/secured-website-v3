"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function StickyQR() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rentMap = document.querySelector('[data-section="rent-map"]');
    const hiw = document.querySelector('[data-section="how-it-works"]');
    const observers: IntersectionObserver[] = [];

    const update = () => {
      setVisible(!rentMapVisible && !hiwVisible);
    };

    let rentMapVisible = false;
    let hiwVisible = false;

    if (rentMap) {
      const o = new IntersectionObserver(
        ([entry]) => { rentMapVisible = entry.isIntersecting; update(); },
        { threshold: 0.15 }
      );
      o.observe(rentMap);
      observers.push(o);
    }
    if (hiw) {
      const o = new IntersectionObserver(
        ([entry]) => { hiwVisible = entry.isIntersecting; update(); },
        { threshold: 0.15 }
      );
      o.observe(hiw);
      observers.push(o);
    }

    if (!rentMap && !hiw) setVisible(true);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div
      className="fixed bottom-[108px] right-12 z-50 hidden md:flex md:items-center"
      style={{
        height: 40,
        pointerEvents: visible ? "auto" : "none",
        transition: "transform 0.5s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1)",
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
      }}
    >
      <a
        href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl bg-black p-3 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0px_12px_32px_rgba(255,154,109,0.3)]"
      >
        <Image
          src="/assets/logos/qr-code.svg"
          alt="Scan QR to download Flent"
          width={96}
          height={96}
          className="3xl:w-[140px] 3xl:h-[140px] 4xl:w-[180px] 4xl:h-[180px] 5xl:w-[240px] 5xl:h-[240px]"
        />
      </a>
    </div>
  );
}
