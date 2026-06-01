"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CARDS = [
  { src: "/assets/cards/hdfc-infinia.jpg", alt: "HDFC Infinia" },
  { src: "/assets/cards/amex-platinum.jpg", alt: "Amex Platinum" },
  { src: "/assets/cards/hdfc-diners-black.jpg", alt: "HDFC Diners Club Black" },
  { src: "/assets/cards/axis-magnus.jpg", alt: "Axis Magnus" },
  { src: "/assets/cards/icici-emeralde.jpg", alt: "ICICI Emeralde" },
  { src: "/assets/cards/sbi-aurum.jpg", alt: "SBI Aurum" },
  { src: "/assets/cards/hsbc-premier.jpg", alt: "HSBC Premier" },
  { src: "/assets/cards/sbi-cashback.jpg", alt: "SBI Cashback" },
];

const CARD_W = 340;
const CARD_H = 215;

export function CardStack() {
  const [stack, setStack] = useState(CARDS.map((_, i) => i));
  const [exitDir, setExitDir] = useState(1);

  const cycleCard = useCallback(() => {
    setExitDir(Math.random() > 0.5 ? 1 : -1);
    setStack((prev) => {
      const next = [...prev];
      const top = next.shift()!;
      next.push(top);
      return next;
    });
  }, []);

  const visibleCount = Math.min(4, stack.length);

  return (
    <section className="relative flex items-center justify-center py-16 md:py-24">
      <div
        className="relative cursor-pointer"
        style={{ width: CARD_W, height: CARD_H }}
        onClick={cycleCard}
      >
        <AnimatePresence mode="popLayout">
          {stack.slice(0, visibleCount).map((cardIdx, stackPos) => {
            const card = CARDS[cardIdx];
            const isTop = stackPos === 0;
            const offset = stackPos * 8;
            const scale = 1 - stackPos * 0.04;
            const rotate = stackPos === 0 ? 0 : (stackPos % 2 === 0 ? -2 : 2) * stackPos;

            return (
              <motion.div
                key={cardIdx}
                className="absolute inset-0 overflow-hidden rounded-2xl"
                style={{
                  boxShadow: isTop
                    ? "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)"
                    : "0 8px 24px rgba(0,0,0,0.3)",
                  zIndex: visibleCount - stackPos,
                  cursor: isTop ? "grab" : "default",
                }}
                initial={false}
                animate={{
                  y: offset,
                  scale,
                  rotate,
                  opacity: stackPos < 3 ? 1 : 0.5,
                }}
                exit={{
                  x: exitDir * 400,
                  y: -80,
                  rotate: exitDir * 25,
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                drag={isTop}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 300) {
                    setExitDir(info.offset.x > 0 ? 1 : -1);
                    setStack((prev) => {
                      const next = [...prev];
                      const top = next.shift()!;
                      next.push(top);
                      return next;
                    });
                  }
                }}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={CARD_W}
                  height={CARD_H}
                  className="pointer-events-none h-full w-full object-cover"
                  draggable={false}
                  priority={stackPos < 2}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
