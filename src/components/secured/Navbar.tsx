"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useVariant } from "./VariantContext";
import { RoleSwitcher } from "./RoleSwitcher";
import { AudioToggle } from "./ScrollAudio";

export function Navbar() {
  const { variant } = useVariant();
  const tickerHeight = variant === "tenant" ? 44 : 0;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed z-[65] w-full"
      style={{ top: tickerHeight }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex w-full items-center justify-between px-6 py-3 md:px-8 lg:px-[120px]">
        <a
          href="/"
          className="pointer-events-auto flex items-center gap-2 3xl:scale-150 4xl:scale-[2] 5xl:scale-[2.8]"
          style={{ transformOrigin: "left center" }}
        >
          <span
            className="text-[18px] leading-[1.2] tracking-[-0.5px] text-[#ff9a6d] md:text-[23.8px]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Secured
          </span>
          <div className="flex items-center gap-1">
            <span
              className="text-[14px] font-light leading-[1.2] tracking-[-0.6px] text-white md:text-[18.5px]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              by
            </span>
            <Image
              src="/assets/icons/flent-wordmark-white.svg"
              alt="flent"
              width={52}
              height={18}
              priority
              className="h-[11px] w-auto md:h-[14.5px]"
            />
          </div>
        </a>

        <div className="pointer-events-auto flex items-center gap-4">
          <AudioToggle />
          <RoleSwitcher />
        </div>
      </div>
    </motion.div>
  );
}
