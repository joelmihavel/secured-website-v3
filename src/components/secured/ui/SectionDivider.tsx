"use client";

import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <div className="relative mx-auto w-full px-6 md:px-12 lg:px-[240px]">
      <motion.div
        className="w-full"
        style={{ height: "0.3px", backgroundColor: "#4D4D4D", transformOrigin: "center" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
