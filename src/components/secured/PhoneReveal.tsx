"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const FRAME = "/assets/illustrations/iphone-frame";

function IPhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "335 / 682" }}>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/bezel.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/bezel-stroke.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/glass.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/glass-stroke.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.73% 39.64% 98.94% 39.41%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/speaker.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 39.52% 98.88% 39.29%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/speaker-stroke.svg`} />
      </div>
      <div
        className="absolute overflow-hidden"
        style={{ inset: "2.02% 4.56% 2.02% 4.78%", borderRadius: "10.5% / 5.2%" }}
      >
        {children}
      </div>
      <div className="absolute" style={{ inset: "28.33% 0 60.58% 99.32%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/buttons-right.svg`} />
      </div>
      <div className="absolute" style={{ inset: "20.04% 99.09% 55.66% 0" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/buttons-left.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.11% 0.68% 0.11% 0.91%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/antenna.svg`} />
      </div>
      <div className="absolute" style={{ inset: "3.58% 36.22% 92.16% 35.99%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/dynamic-island.svg`} />
      </div>
    </div>
  );
}

export function PhoneReveal() {
  const phoneRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: phoneRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0.15, 0.55], [55, 0]);
  const scale = useTransform(scrollYProgress, [0.15, 0.55], [0.9, 1]);

  return (
    <div ref={phoneRef} style={{ perspective: 1000 }}>
      <motion.div style={{ rotateX, scale }}>
        <IPhoneFrame className="w-[300px] md:w-[340px] lg:w-[380px] 3xl:w-[460px] 4xl:w-[560px] 5xl:w-[740px]">
          <Image
            src="/assets/screens/app-home.png"
            alt="Secured app"
            fill
            className="object-fill"
            sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
            priority
          />
        </IPhoneFrame>
      </motion.div>
    </div>
  );
}
