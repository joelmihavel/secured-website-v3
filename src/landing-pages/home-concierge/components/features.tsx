"use client"

import { useRef } from "react"
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
}: {
  feature: Feature
  index: number
  inView: boolean
}) {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="flex h-full flex-col rounded-xl border border-border/60 bg-card p-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)] lg:rounded-2xl"
    >
      {/* Icon + title — title wraps to its own line when it can't fit beside the icon */}
      <div className="mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 lg:mb-3">
        <div
          className={`flex h-8 w-7 shrink-0 items-center justify-center arch-clip-sm ${feature.bgColor}`}
        >
          <Icon className={`h-3.5 w-3.5 ${feature.iconColor}`} strokeWidth={2} />
        </div>
        <h3 className="min-w-0 text-sm font-semibold leading-tight text-flent-dark">
          {feature.title}
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </motion.div>
  )
}

export function Features() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

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
      <div className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </section>
  )
}
