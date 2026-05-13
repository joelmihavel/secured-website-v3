"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { triggerFormAttention } from "@landing-pages/home-concierge/lib/form-attention"
import { captureUTMs } from "@landing-pages/home-concierge/lib/hubspot"

export function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { captureUTMs() }, [])

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 10)
  })

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Image
          src="/flent-logo.png"
          alt="Flent"
          width={80}
          height={32}
          className="h-8"
          style={{ width: "auto" }}
          priority
        />
        <button
          type="button"
          onClick={triggerFormAttention}
          className="btn-retro rounded-full bg-flent-green px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-flent-green/90"
        >
          Find your home →
        </button>
      </div>
    </motion.nav>
  )
}
