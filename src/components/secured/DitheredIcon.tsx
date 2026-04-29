"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export function DitheredIcon({
  src,
  alt = "",
  size = 80,
  className = "",
}: {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });

  return (
    <div ref={ref} className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Glow backdrop */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(140,140,140,0.15) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
        animate={isInView ? { opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] } : { opacity: 0 }}
        transition={{ duration: 3, repeat: 2, ease: "easeInOut" }}
      />

      {/* Icon with reveal + float */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={
          isInView
            ? { opacity: 1, y: [0, -4, 0] }
            : { opacity: 0, y: 12 }
        }
        transition={
          isInView
            ? { opacity: { duration: 0.5 }, y: { duration: 3, repeat: 2, ease: "easeInOut" } }
            : { duration: 0.3 }
        }
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="relative z-10 h-auto w-auto"
          style={{ imageRendering: "pixelated" }}
        />
      </motion.div>
    </div>
  );
}
