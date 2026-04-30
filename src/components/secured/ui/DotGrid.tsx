"use client";

import { useRef, useCallback, useEffect, useState } from "react";

const ROW_OPACITIES = [0.8, 0.64, 0.56, 0.4, 0.24, 0.16, 0.04];

const HIDDEN_CELLS: Record<number, Set<number>> = {
  0: new Set([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17]),
  1: new Set([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
  2: new Set([8, 19]),
  3: new Set([1, 6, 15]),
  4: new Set([10]),
  5: new Set([5, 12, 18]),
  6: new Set([3, 15]),
};

const HOME_IMAGES = Array.from({ length: 39 }, (_, i) => `/assets/homes/home-${i + 1}.webp`);
const COLS = 22;
const RADIUS = 3;

// Deterministic hash to spread images evenly without visible repetition
function getImageForCell(row: number, col: number): string {
  const hash = ((row * 7 + col * 13 + row * col * 3) * 2654435761) >>> 0;
  return HOME_IMAGES[hash % HOME_IMAGES.length];
}

function distance(r1: number, c1: number, r2: number, c2: number): number {
  return Math.sqrt((r1 - r2) ** 2 + (c1 - c2) ** 2);
}

export function DotGrid({ flipped = false }: { flipped?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [mouseCell, setMouseCell] = useState<{ row: number; col: number } | null>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cellW = rect.width / COLS;
      const cellH = rect.height / ROW_OPACITIES.length;
      const col = Math.floor(x / cellW);
      const rawRow = Math.floor(y / cellH);
      const row = flipped ? (ROW_OPACITIES.length - 1 - rawRow) : rawRow;

      if (rawRow >= 0 && rawRow < ROW_OPACITIES.length && col >= 0 && col < COLS) {
        setMouseCell({ row, col });
      } else {
        setMouseCell(null);
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setMouseCell(null);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="hidden overflow-hidden lg:block" aria-hidden="true">
      <div
        ref={containerRef}
        className={`flex gap-[4px] px-[120px] ${flipped ? "flex-col-reverse" : "flex-col"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {ROW_OPACITIES.map((opacity, rowIdx) => (
          <div key={rowIdx} className="flex gap-[4px]">
            {Array.from({ length: COLS }).map((_, colIdx) => {
              const isHidden = HIDDEN_CELLS[rowIdx]?.has(colIdx);
              const cellKey = `${rowIdx}-${colIdx}`;
              const dist = mouseCell
                ? distance(rowIdx, colIdx, mouseCell.row, mouseCell.col)
                : Infinity;
              const isActive = !isHidden && dist <= RADIUS;
              const imgOpacity = isActive
                ? Math.max(0.3, 0.85 - (dist / RADIUS) * 0.55)
                : 0;

              return (
                <div
                  key={colIdx}
                  ref={(el) => {
                    if (el) cellRefs.current.set(cellKey, el);
                  }}
                  className="relative h-[56px] flex-1 overflow-hidden rounded-[8px]"
                  style={{ opacity: isHidden ? 0 : opacity }}
                >
                  <div
                    className="absolute inset-0 bg-[#1a1a1a]"
                    style={{
                      opacity: isActive ? 0 : 1,
                      transition: "opacity 0.15s ease-out",
                    }}
                  />
                  {!isHidden && (
                    <img
                      src={getImageForCell(rowIdx, colIdx)}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        opacity: imgOpacity,
                        transition: "opacity 0.15s ease-out",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
