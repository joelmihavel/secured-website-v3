"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, animate } from "framer-motion"

const stats = [
  { end: 200, suffix: "+", prefix: "", label: "Homes across Bangalore" },
  { end: 58, suffix: "", prefix: "", label: "Quality checks per home" },
  { end: 5, suffix: "L+", prefix: "₹", label: "Invested per home in design & setup" },
]

function CountUp({
  end,
  suffix,
  prefix,
  inView,
}: {
  end: number
  suffix: string
  prefix: string
  inView: boolean
}) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true
    const controls = animate(0, end, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1] as const,
      onUpdate: (v) => setCount(Math.round(v)),
    })
    return controls.stop
  }, [inView, end])

  return (
    <p className="font-serif text-3xl font-bold text-flent-green lg:text-5xl">
      {prefix}{count}{suffix}
    </p>
  )
}

export function StatsBar() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-4 text-center lg:px-8 lg:py-8">
            <CountUp end={stat.end} suffix={stat.suffix} prefix={stat.prefix} inView={inView} />
            <p className="mt-1 text-xs font-medium text-muted-foreground lg:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
