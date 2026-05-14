"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { triggerFormAttention } from "@landing-pages/home-concierge/lib/form-attention"

const properties = [
  {
    name: "Arcade",
    location: "Bellandur",
    bhk: "3 BHK",
    sqft: "1,700 sqft",
    price: "33,000",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Arcade-tVDtwFu4kcwJLAtpCOGYAIjXR18vwe.avif",
    available: "Available Now",
  },
  {
    name: "Nexus",
    location: "Bellandur",
    bhk: "2 BHK",
    sqft: "1,450 sqft",
    price: "37,000",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nexus-2xU0jtVj2b0lSjEJ0GJy4BHmFaLyq6.avif",
    available: "1 room left",
  },
  {
    name: "Fairmont",
    location: "HSR Layout",
    bhk: "3 BHK",
    sqft: "2,000 sqft",
    price: "36,000",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fairmont-XM8c8dba8yL3sCluRK5zYni0C9TFwc.avif",
    available: "1 room left",
  },
  {
    name: "Belmont",
    location: "HSR Layout",
    bhk: "3 BHK",
    sqft: "2,000 sqft",
    price: "35,000",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Belmont-2CpagZ5EyT7IemZI7KBy65y3yPJfnc.avif",
    available: "2 rooms left",
  },
]

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

export function PropertyCards() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 font-serif text-3xl font-bold text-flent-dark lg:text-4xl"
      >
        View some of our homes
      </motion.h2>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {properties.map((property) => (
          <motion.button
            key={property.name}
            variants={cardVariants}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            type="button"
            onClick={triggerFormAttention}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm hover:shadow-lg"
          >
            {/* Arch-shaped image */}
            <div className="relative mx-4 mt-4 arch-clip">
              <div className="relative aspect-[4/3]">
                <Image
                  src={property.image}
                  alt={`${property.name} — ${property.location}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Location tag */}
              <span className="absolute bottom-3 left-3 rounded-full bg-flent-dark/70 px-3 py-1 text-xs font-semibold text-card backdrop-blur-sm">
                {property.location}
              </span>
            </div>

            {/* Card body */}
            <div className="px-5 pb-5 pt-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-xl font-bold text-flent-dark">
                  {property.name}
                </h3>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  property.available.includes("left")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {property.available}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>{property.bhk}</span>
                <span aria-hidden="true" className="text-border">{"·"}</span>
                <span>{property.sqft}</span>
              </div>
              <p className="mt-3 text-base font-bold text-flent-dark">
                {"From ₹"}{property.price}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  /month per room
                </span>
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* View more homes CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.5 }}
        type="button"
        onClick={triggerFormAttention}
        className="btn-retro mt-6 w-full rounded-lg bg-flent-dark px-6 py-4 text-sm font-bold text-card hover:bg-flent-dark/90"
      >
        {"View more homes →"}
      </motion.button>
    </section>
  )
}
