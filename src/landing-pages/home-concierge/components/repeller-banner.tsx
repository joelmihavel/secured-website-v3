"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const noItems = [
  { text: "No 1BHKs or standalone studios" },
  { text: "No rooms under ₹26,000/month" },
]

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.45 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export function RepellerBanner() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="overflow-hidden rounded-2xl bg-flent-dark p-6 lg:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        {/* Big "No." */}
        <motion.p
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="shrink-0 font-serif text-5xl font-black italic text-flent-red lg:text-8xl"
        >
          No.
        </motion.p>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}
          >
            <h2 className="mb-1.5 font-serif text-xl font-bold text-card lg:text-3xl">
              This isn&apos;t for everyone.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-card/70 lg:text-base">
              If you&apos;re looking for a 1BHK or a room under ₹26k, we&apos;re
              not it. Flent is for people who value design, privacy, and
              city-ready living.
            </p>
          </motion.div>

          {/* Staggered no/yes list */}
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex flex-col gap-2"
          >
            {noItems.map((item) => (
              <motion.li
                key={item.text}
                variants={itemVariants}
                className="flex items-center gap-2.5 text-sm font-medium text-card/60 lg:text-base"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-flent-red/20 text-xs font-bold text-flent-red">
                  ✕
                </span>
                {item.text}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
