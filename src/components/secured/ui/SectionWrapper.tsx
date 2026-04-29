"use client";

import { motion } from "framer-motion";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mx-auto w-full px-6 md:px-12 lg:px-[240px] ${className}`}
    >
      {children}
    </motion.section>
  );
}
