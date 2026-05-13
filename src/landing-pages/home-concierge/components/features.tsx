"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Armchair, ChefHat, ConciergeBell, Wrench, BadgeCheck, DoorOpen } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  bgColor: string
  iconColor: string
}

const features: Feature[] = [
  {
    icon: Armchair,
    title: "Fully Furnished",
    description: "Beds, wardrobes, desks — all set from day one.",
    bgColor: "bg-flent-pastel-green",
    iconColor: "text-flent-green",
  },
  {
    icon: ChefHat,
    title: "Loaded Kitchen",
    description: "Fridge, microwave, induction & cookware included.",
    bgColor: "bg-flent-pastel-orange",
    iconColor: "text-flent-orange",
  },
  {
    icon: ConciergeBell,
    title: "Single POC",
    description: "One contact for all maintenance. No juggling.",
    bgColor: "bg-flent-pastel-violet",
    iconColor: "text-flent-violet",
  },
  {
    icon: Wrench,
    title: "Zero Maintenance",
    description: "Anything breaks? We fix it. All on us.",
    bgColor: "bg-flent-pastel-green",
    iconColor: "text-flent-green",
  },
  {
    icon: BadgeCheck,
    title: "No Brokerage",
    description: "No middlemen, no hidden fees. Direct with Flent.",
    bgColor: "bg-flent-pastel-orange",
    iconColor: "text-flent-orange",
  },
  {
    icon: DoorOpen,
    title: "Easy Move Outs",
    description: "One-month notice. Simple process. No penalties.",
    bgColor: "bg-flent-pastel-violet",
    iconColor: "text-flent-violet",
  },
]

function FeatureCard({
  feature,
  index,
  inView,
  shouldNudge,
}: {
  feature: Feature
  index: number
  inView: boolean
  shouldNudge: boolean
}) {
  const [flipped, setFlipped] = useState(false)
  const [hasNudged, setHasNudged] = useState(false)
  const Icon = feature.icon

  const applyNudge = shouldNudge && !hasNudged && !flipped

  function handleFlip() {
    setFlipped((f) => !f)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleFlip()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="perspective-1000 h-28 cursor-pointer lg:h-auto lg:cursor-default"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${feature.title}: ${feature.description}`}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 lg:transform-none ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        } ${applyNudge ? "animate-nudge-flip" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
        onAnimationEnd={() => {
          if (applyNudge) setHasNudged(true)
        }}
      >
        {/* Front - Icon & Title */}
        <div
          className="absolute inset-0 rounded-xl border border-border bg-card p-4 shadow-sm lg:relative lg:rounded-2xl lg:p-6 lg:backface-visible"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={`mb-3 flex h-10 w-8 items-center justify-center arch-clip-sm lg:mb-4 lg:h-14 lg:w-11 ${feature.bgColor}`}
          >
            <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${feature.iconColor}`} strokeWidth={2.5} />
          </div>
          <h3 className="text-sm font-bold text-flent-dark lg:mb-1.5 lg:text-base">
            {feature.title}
          </h3>
          <p className="hidden text-sm leading-relaxed text-muted-foreground lg:block">
            {feature.description}
          </p>
        </div>

        {/* Back - Description (mobile only) */}
        <div
          className="absolute inset-0 flex items-center rounded-xl border border-border bg-flent-dark p-4 shadow-sm lg:hidden [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-sm leading-relaxed text-white">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function Features() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [shouldNudge, setShouldNudge] = useState(false)

  useEffect(() => {
    if (!inView) return
    // Delay nudge until cards have finished staggering in (6 cards × 80ms + 400ms duration ≈ 880ms)
    const timer = setTimeout(() => setShouldNudge(true), 900)
    return () => clearTimeout(timer)
  }, [inView])

  return (
    <section ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-5 font-serif text-2xl font-bold text-flent-dark lg:mb-8 lg:text-4xl"
      >
        What comes with every door
      </motion.h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            index={index}
            inView={inView}
            shouldNudge={shouldNudge}
          />
        ))}
      </div>
    </section>
  )
}
