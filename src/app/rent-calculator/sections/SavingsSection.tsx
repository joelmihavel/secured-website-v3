import { DURATION } from "../constants";
import type { ComparisonMode, SpendIdea } from "../types";
import { formatCurrency } from "../utils";

type SavingsSectionProps = {
  savings: number;
  flentWins: boolean;
  affordItems: SpendIdea[];
  mode: ComparisonMode;
  area: string;
};

export function SavingsSection({
  savings,
  flentWins,
  affordItems,
  mode,
  area,
}: SavingsSectionProps) {
  return (
    <section
      className="mb-5 rounded-2xl bg-ground-brown px-6 py-7 text-left text-bg-white"
    >
      <div
        className={`mb-1 font-zin text-fluid-h1 ${
          flentWins ? "text-bg-white" : "text-brand-orange"
        }`}
      >
        {formatCurrency(savings)}
      </div>
      <p className="mb-3 text-subtitle-sm font-body text-bg-white/80">
        {flentWins ? "Saved over 11 months" : `Premium over ${DURATION} months`}
      </p>

      {flentWins ? (
        <p className="mb-4 max-w-xl text-subtitle-sm font-body text-bg-white/85">
          by choosing Flent over{" "}
          {mode === "1bhk" ? `a 1BHK in ${area}` : `finding flatmates in ${area}`} - and
          you move into a fully furnished, designer home from day one.
        </p>
      ) : (
        <p className="mb-4 max-w-xl text-subtitle-sm font-body text-bg-white/85">
          That&apos;s {formatCurrency(Math.round(Math.abs(savings) / DURATION))}/mo for a fully
          furnished designer home - zero brokerage, no deposit drama, move-in ready.
        </p>
      )}

      {flentWins && affordItems.length > 0 ? (
        <div className="mt-5">
          {/* <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-bg-white/60">
            Or use that for
          </div> */}
          {/* <div className="flex flex-wrap gap-2">
            {affordItems.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-bg-white/15 px-3 py-1.5"
              >
                <span className="text-base">{item.emoji}</span>
                <span className="text-xs font-bold">{item.label}</span>
                <span className="text-[11px] text-bg-white/60">{formatCurrency(item.cost)}</span>
              </div>
            ))}
          </div> */}
        </div>
      ) : null}
    </section>
  );
}
