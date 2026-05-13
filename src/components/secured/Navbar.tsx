"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useVariant } from "./VariantContext";
import { RoleSwitcher } from "./RoleSwitcher";

export function Navbar() {
  const { variant } = useVariant();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed z-[65] w-full"
      style={{ top: scrolled ? 30 : 24 }}
      animate={{ top: scrolled ? 30 : 24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
    >
        {/* Background — fades in on scroll */}
        <motion.div
          className="absolute inset-0 border-b border-white/[0.06] bg-[#0d0d0d]"
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="relative flex w-full items-center justify-between px-6 md:px-8 lg:px-[240px]"
          animate={{
            paddingTop: scrolled ? 12 : variant === "tenant" ? 40 : 24,
            paddingBottom: scrolled ? 12 : 8,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Logo — morphs from stacked to inline */}
          <a
            href="/"
            className="pointer-events-auto 3xl:scale-150 4xl:scale-[2] 5xl:scale-[2.8]"
            style={{ transformOrigin: "left center" }}
          >
            <motion.div
              className="flex items-end"
              animate={{
                flexDirection: scrolled ? "row" as const : "column" as const,
                alignItems: scrolled ? "center" : "flex-end",
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <span
                className="text-[18px] leading-[1.2] tracking-[-0.5px] text-[#ff9a6d] md:text-[23.8px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Secured
              </span>
              <motion.div
                className="flex items-center gap-2"
                animate={{ marginLeft: scrolled ? 8 : 0, marginTop: scrolled ? 0 : 3 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <span
                  className="text-[16px] font-light leading-[1.2] tracking-[-0.8px] text-white md:text-[22.4px]"
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
                  className="h-[14px] w-auto md:h-[18px]"
                />
              </motion.div>
            </motion.div>
          </a>

          <RoleSwitcher />
      </motion.div>
    </motion.div>
  );
}
