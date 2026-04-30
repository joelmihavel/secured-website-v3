"use client";

const TICKER_TEXT = "1% cashback + ₹1000 extra on timely rent this month.";
const REPEAT = 8;

export function TickerBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] w-full overflow-hidden bg-[#ff9a6d] py-1.5">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: "ticker-scroll 18s linear infinite",
          willChange: "transform",
        }}
      >
        {Array.from({ length: REPEAT }).map((_, i) => (
          <span
            key={i}
            className="mx-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0d0d0d] md:mx-5 md:text-[12px]"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {TICKER_TEXT}
            <span className="mx-4 text-[#0d0d0d]/30 md:mx-5">✦</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes ticker-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
