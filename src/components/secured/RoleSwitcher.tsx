"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useVariant } from "./VariantContext";

const LABEL = {
  tenant: "I'm a Tenant",
  landlord: "I'm a Landlord",
} as const;

const REVEAL_EASE = [0.625, 0.05, 0, 1] as const;
const TOGGLE_EASE = [0.22, 1, 0.36, 1] as const;

export function RoleSwitcher() {
  const { variant, setVariant } = useVariant();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const other = variant === "tenant" ? "landlord" : "tenant";

  return (
    <div
      ref={ref}
      className="pointer-events-auto relative"
      style={{ fontFamily: "var(--font-ui)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-[10px] rounded-[50px] bg-[#1a1a1a] px-6 py-2 text-[14px] font-semibold leading-5 text-white transition-colors duration-200 hover:bg-[#222] 3xl:gap-3 3xl:px-7 3xl:py-2.5 3xl:text-lg 4xl:gap-3.5 4xl:px-9 4xl:py-3 4xl:text-xl 5xl:gap-4 5xl:px-11 5xl:py-4 5xl:text-2xl"
        style={{ boxShadow: "0px -3px 2px 0px #202020, 0px 4px 6px 0px rgba(0,0,0,0.12), 0px 10px 10px 0px rgba(0,0,0,0.12)" }}
      >
        <span>{LABEL[variant]}</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className="3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.4, ease: TOGGLE_EASE }}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: REVEAL_EASE }}
            className="absolute right-0 top-[calc(100%+8px)] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl shadow-black/40"
          >
            <motion.button
              type="button"
              onClick={() => {
                setVariant(other);
                setOpen(false);
              }}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: REVEAL_EASE, delay: 0.05 }}
              className="block w-full px-4 py-2.5 text-left text-sm font-bold leading-5 text-white/70 transition-colors duration-150 hover:bg-[#ff9a6d] hover:text-[#131313] md:px-5 md:py-3 md:text-base 3xl:px-7 3xl:py-3.5 3xl:text-lg 4xl:px-9 4xl:py-4 4xl:text-xl 5xl:px-11 5xl:py-5 5xl:text-2xl"
            >
              {LABEL[other]}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
