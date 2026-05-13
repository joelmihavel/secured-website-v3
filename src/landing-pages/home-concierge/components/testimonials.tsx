"use client"

import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    quote: "No brokers, no hefty deposits. Moved seamlessly between fully furnished homes.",
    name: "Ayush Tripathi",
    role: "Product Manager, MIQ",
  },
  {
    quote: "Originally booked for 3 months, happily extended to 12. The team is incredibly supportive.",
    name: "Harshit K",
    role: "Software Engineer, Walmart",
  },
  {
    quote: "Booked based on pictures alone — it was exactly as shown. The balcony is perfect for hangouts.",
    name: "Aayush Khazanchi",
    role: "Investment Banking Analyst, JM Financial",
  },
  {
    quote: "Pool view, great ventilation, tastefully furnished. Plus access to all building amenities.",
    name: "Gautam Kakadiya",
    role: "Senior Software Engineer, VerSe",
  },
]

const tweetImages = [
  "/tweets/Tweet 1.png",
  "/tweets/Tweet 2.png",
  "/tweets/Tweet 3.png",
  "/tweets/Tweet 5.png",
  "/tweets/Tweet 6.png",
  "/tweets/Tweet 7.png",
  "/tweets/Tweet 9.png",
  "/tweets/Tweet 10.png",
  "/tweets/Tweet 11.png",
  "/tweets/Tweet 12.png",
]

function MarqueeTrack({
  children,
  direction = "left",
}: {
  children: React.ReactNode
  direction?: "left" | "right"
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animationId: number
    let position = direction === "left" ? 0 : -track.scrollWidth / 2

    const animate = () => {
      if (!pausedRef.current) {
        if (direction === "left") {
          position -= 0.5
          if (position <= -track.scrollWidth / 2) position = 0
        } else {
          position += 0.5
          if (position >= 0) position = -track.scrollWidth / 2
        }
        track.style.transform = `translateX(${position}px)`
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [direction])

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
      }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div ref={trackRef} className="flex gap-4 whitespace-nowrap">
        {children}
        {children}
      </div>
    </div>
  )
}

function StarRating() {
  return (
    <div className="mb-2 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-3 w-3" viewBox="0 0 24 24" fill="#FFE98A">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="inline-flex w-64 shrink-0 flex-col rounded-xl border border-border bg-card p-4 shadow-sm lg:w-80 lg:rounded-2xl lg:p-5">
      <StarRating />
      <span
        className="mb-1 font-serif text-2xl leading-none text-flent-orange lg:mb-2 lg:text-3xl"
        aria-hidden="true"
      >
        {"“"}
      </span>
      <p className="mb-3 whitespace-normal text-xs leading-relaxed text-flent-dark lg:mb-4 lg:text-sm">
        {testimonial.quote}
      </p>
      <div className="mt-auto">
        <p className="text-xs font-bold text-flent-dark lg:text-sm">{testimonial.name}</p>
        <p className="text-[10px] text-muted-foreground lg:text-xs">{testimonial.role}</p>
      </div>
    </div>
  )
}

function TweetImage({ src }: { src: string }) {
  return (
    <div className="inline-block shrink-0 overflow-hidden rounded-lg shadow-sm lg:rounded-xl">
      <Image
        src={src}
        alt="Social proof from a Flent tenant on X"
        width={320}
        height={400}
        className="h-48 w-auto object-contain lg:h-72"
        unoptimized
      />
    </div>
  )
}

export function Testimonials() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  const tweetRef = useRef<HTMLDivElement>(null)
  const tweetInView = useInView(tweetRef, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="space-y-6 lg:space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="font-serif text-2xl font-bold text-flent-dark lg:text-4xl"
      >
        What tenants say
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MarqueeTrack direction="left">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </MarqueeTrack>
      </motion.div>

      <div ref={tweetRef} className="pt-2 lg:pt-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={tweetInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-3 font-serif text-2xl font-bold text-flent-dark lg:mb-4 lg:text-4xl"
        >
          People on X
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={tweetInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MarqueeTrack direction="right">
            {tweetImages.map((src) => (
              <TweetImage key={src} src={src} />
            ))}
          </MarqueeTrack>
        </motion.div>
      </div>
    </section>
  )
}
