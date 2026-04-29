"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useVariant } from "./VariantContext";

export function Navbar() {
  const { variant, setVariant } = useVariant();

  return (
    <div
      className={`pointer-events-none fixed z-[60] w-full ${variant === "tenant" ? "top-7" : "top-0"}`}
    >
      <div className="flex w-full items-center justify-between px-6 pb-2 pt-6 md:px-8 lg:px-[240px] lg:pt-[80px]">
        {/* Left — Secured by flent logo */}
        <a href="/" data-navbar-logo className="pointer-events-auto 3xl:scale-150 4xl:scale-[2] 5xl:scale-[2.8]" style={{ transformOrigin: "left center" }}>
          <div className="flex flex-col items-end gap-[3px]">
            <span
              className="text-[18px] leading-[18px] tracking-[-0.6px] text-[#ff9a6d]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Secured
            </span>
            <div className="flex items-center gap-[4px]">
              <span
                className="text-[14px] leading-[16px] tracking-[-0.5px] font-light text-white"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                by
              </span>
              <Image
                src="/assets/icons/flent-wordmark-white.svg"
                alt="flent"
                width={40}
                height={14}
                priority
                className="h-[11px] w-auto"
              />
            </div>
          </div>
        </a>

        {/* Right — Tenant/Landlord toggle */}
        <div
          className="pointer-events-auto flex whitespace-nowrap rounded-full border border-[#2e2e2e] bg-[#1f1f1f] p-1 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)]"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          <button
            onClick={() => setVariant("tenant")}
            className={`relative rounded-[50px] px-4 py-1.5 text-xs leading-5 transition-all duration-200 md:px-5 md:py-1.5 md:text-sm 3xl:px-7 3xl:py-2.5 3xl:text-base 4xl:px-9 4xl:py-3 4xl:text-lg 5xl:px-11 5xl:py-4 5xl:text-xl ${
              variant === "tenant" ? "font-semibold text-black" : "font-medium text-[#bbb] hover:text-white"
            }`}
          >
            {variant === "tenant" && (
              <motion.div
                layoutId="nav-toggle-bg"
                className="absolute inset-0 rounded-[50px] bg-[#ff9a6d] shadow-[0px_4px_6px_0px_rgba(255,154,109,0.15)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">Tenant</span>
          </button>
          <button
            onClick={() => setVariant("landlord")}
            className={`relative rounded-[50px] px-4 py-1.5 text-xs leading-5 transition-all duration-200 md:px-5 md:py-1.5 md:text-sm 3xl:px-7 3xl:py-2.5 3xl:text-base 4xl:px-9 4xl:py-3 4xl:text-lg 5xl:px-11 5xl:py-4 5xl:text-xl ${
              variant === "landlord" ? "font-semibold text-black" : "font-medium text-[#bbb] hover:text-white"
            }`}
          >
            {variant === "landlord" && (
              <motion.div
                layoutId="nav-toggle-bg"
                className="absolute inset-0 rounded-[50px] bg-[#ff9a6d] shadow-[0px_4px_6px_0px_rgba(255,154,109,0.15)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">Landlord</span>
          </button>
        </div>
      </div>
    </div>
  );
}
