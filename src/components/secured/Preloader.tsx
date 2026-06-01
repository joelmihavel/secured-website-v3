"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import CosmicBackground from "./CosmicBackground";

interface PreloaderProps {
  onEnter: (withSound: boolean) => void;
}

export function Preloader({ onEnter }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleEnter = (withSound: boolean) => {
    setExiting(true);
    document.body.style.overflow = "";
    onEnter(withSound);
    setTimeout(() => setVisible(false), 1800);
  };

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <CosmicBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="text-[26px] leading-[1.2] tracking-[-0.5px] text-[#ff9a6d] md:text-[32px]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Secured
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[18px] font-light leading-[1.2] tracking-[-0.6px] text-white md:text-[22px]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              by
            </span>
            <Image
              src="/assets/icons/flent-wordmark-white.svg"
              alt="flent"
              width={64}
              height={22}
              priority
              className="h-[15px] w-auto md:h-[18px]"
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-[14px] tracking-[-0.3px] text-[#555] md:text-[16px]"
          style={{ fontFamily: "var(--font-ui)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          welcome to the right side of renting
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => handleEnter(true)}
            className="flex items-center justify-center gap-2.5 rounded-full bg-[#ff9a6d] px-10 py-4 text-[14px] font-semibold text-[#131313] transition-all duration-200 hover:bg-[#ffb08a]"
            style={{ fontFamily: "var(--font-ui)", minWidth: "220px" }}
          >
            Enter Secured →
          </button>

          <button
            onClick={() => handleEnter(false)}
            className="text-[13px] tracking-[-0.2px] text-[#454545] transition-colors hover:text-white/50"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Enter without sound
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
