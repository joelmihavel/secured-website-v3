"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const DOT_SIZE = 1.088;
const DOT_GAP = 0.05;
const CELL = DOT_SIZE;
const ROWS_PER_LINE = 2;
const GROUP_GAP = 4.09;

const GROUPS: [number, string][] = [
  [4, "#4D4D4D"],
  [3, "#797979"],
  [2, "#A6A6A6"],
  [1, "#D2D2D2"],
];

function DotGridRow({
  height,
  color,
  index,
  animate,
}: {
  height: number;
  color: string;
  index: number;
  animate: boolean;
}) {
  const dotRadius = (DOT_SIZE - DOT_GAP) / 2;
  const patternId = `dot-${color.replace("#", "")}`;

  return (
    <motion.div
      style={{ width: "100%", height, overflow: "hidden" }}
      initial={{ opacity: 0, y: 20, scaleX: 0.6 }}
      animate={
        animate
          ? { opacity: 1, y: 0, scaleX: 1 }
          : { opacity: 0, y: 20, scaleX: 0.6 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <svg
        width="100%"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={patternId}
            width={CELL}
            height={CELL}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={CELL / 2} cy={CELL / 2} r={dotRadius} fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </motion.div>
  );
}

export function GridDivider({ variant }: { variant?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [animateKey, setAnimateKey] = useState(0);
  const [show, setShow] = useState(true);
  const prevVariant = useRef(variant);

  useEffect(() => {
    if (prevVariant.current !== variant && prevVariant.current !== undefined) {
      // Reset animation: hide, then show with new key
      setShow(false);
      const timer = setTimeout(() => {
        setAnimateKey((k) => k + 1);
        setShow(true);
      }, 150);
      prevVariant.current = variant;
      return () => clearTimeout(timer);
    }
    prevVariant.current = variant;
  }, [variant]);

  return (
    <div
      ref={ref}
      className="relative z-10 w-full overflow-hidden opacity-[0.48]"
      aria-hidden="true"
      style={{ padding: 0, margin: 0 }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: GROUP_GAP,
          width: "100%",
        }}
      >
        {GROUPS.map(([lineCount, color], gi) => (
          <DotGridRow
            key={`${gi}-${animateKey}`}
            height={lineCount * ROWS_PER_LINE * CELL}
            color={color}
            index={gi}
            animate={isInView && show}
          />
        ))}
      </div>
    </div>
  );
}
