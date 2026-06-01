"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "./ui/FadeIn";
import { SlideUp } from "./ui/TextReveal";
import type { FaqItem } from "@/lib/secured/types";
import { DotGrid } from "./ui/DotGrid";

function TypewriterText({ text }: { text: string }) {
  const words = text.split(" ");
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (words.length === 0) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= words.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [text, words.length]);

  return (
    <span>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transition: "opacity 0.15s ease",
          }}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FadeIn delay={0.05 * index}>
      <div
        className={`rounded-[16px] p-4 transition-colors duration-300 sm:p-5 md:p-6 lg:p-[32px] ${
          isOpen
            ? "bg-[#cc7b57]"
            : "bg-[#1a1a1a] hover:bg-[#242424]"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-6 text-left lg:gap-[32px]"
        >
          <span
            className={`text-base leading-[1.4] md:text-lg lg:text-[20px] lg:leading-[32px] ${
              isOpen ? "text-[#060606]" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {question}
          </span>
          <div
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
              isOpen ? "bg-black/20" : "bg-[#ff9a6d]"
            }`}
          >
            <svg className="h-[14px] w-[14px]" viewBox="0 0 14 14" fill="none">
              {isOpen ? (
                <path d="M1 7h12" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M7 1v12M1 7h12" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <p
                  className="text-sm font-medium leading-[1.6] text-[#060606] md:text-base"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  <TypewriterText text={answer} />
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <section className="">
      <div className="h-[60px] md:h-[80px] lg:h-[120px]" />

      {/* Header — left-aligned */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="py-8 md:py-12 lg:px-[120px] lg:pb-[64px] lg:pt-[64px]">
          <div className="text-center lg:text-left">
            <SlideUp>
              <p
                className="text-sm leading-[1.6] tracking-[-0.32px] text-[#797979] md:text-base lg:text-[20px] lg:leading-[32px]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                FAQs
              </p>
            </SlideUp>
            <h2
              className="mx-auto mt-3 max-w-[850px] text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:mt-4 md:text-[36px] lg:mx-0 lg:mt-[16px] lg:max-w-[715px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              <span className="text-white">Good renters ask </span>
              <span className="text-[#ff9a6d]">Important Questions</span>
            </h2>
          </div>
        </div>
      </div>

      {/* FAQ items */}
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="lg:px-[120px]">
          <div className="flex flex-col gap-2 pb-6 lg:gap-[8px] lg:pb-[80px]">
            {items.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Dot grid illustration below FAQ */}
      <DotGrid flipped />
    </section>
  );
}
