"use client"

import { motion } from "framer-motion"
import { triggerFormAttention } from "@landing-pages/home-concierge/lib/form-attention"

const qualificationPills = [
  { label: "Fully furnished", border: "border-flent-red", dot: "bg-flent-red" },
  { label: "Secured areas", border: "border-flent-violet", dot: "bg-flent-violet" },
  { label: "Rooms from ₹26k/mo", border: "border-flent-green", dot: "bg-flent-green" },
  { label: "Low deposits", border: "border-flent-orange", dot: "bg-flent-orange" },
  { label: "24/7 support", border: "border-flent-red", dot: "bg-flent-red" },
  { label: "Kitchen ready", border: "border-flent-yellow", dot: "bg-flent-yellow" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
}

export function Hero() {
  return (
    <motion.section variants={container} initial="hidden" animate="show">
      {/* Availability tag */}
      <motion.div
        variants={item}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm"
      >
        <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-flent-green" />
        <span className="text-sm font-medium text-flent-dark">
          Premium homes available now
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={item}
        className="mb-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight text-flent-dark lg:text-7xl"
      >
        Renting that finally respects{" "}
        <em className="text-flent-red">your taste and time.</em>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={item}
        className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
      >
        Private rooms from{" "}
        <span className="font-semibold text-flent-dark">₹26,000/mo</span>
        {" "}· Full homes from{" "}
        <span className="font-semibold text-flent-dark">₹60,000/mo</span>
        . Fully furnished, move-in ready. No brokerage, no landlord drama.
      </motion.p>

      {/* Qualification pills - 3x2 grid */}
      <motion.div variants={item} className="grid grid-cols-3 gap-2 lg:gap-3">
        {qualificationPills.map((pill) => (
          <motion.button
            key={pill.label}
            type="button"
            onClick={triggerFormAttention}
            whileHover={{ y: -2, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            className={`flex items-center justify-center gap-1.5 rounded-full border-2 bg-card px-2.5 py-2 text-xs font-medium text-flent-dark shadow-sm hover:shadow-md lg:border lg:px-4 lg:text-sm ${pill.border} lg:border-border`}
          >
            <span className={`hidden h-1.5 w-1.5 shrink-0 rounded-full lg:inline-block ${pill.dot}`} />
            {pill.label}
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  )
}
