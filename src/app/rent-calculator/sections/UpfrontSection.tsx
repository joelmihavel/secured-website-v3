import { formatCurrency } from "../utils";

type UpfrontSectionProps = {
  flentUpfront: number;
  tradUpfront: number;
};

export function UpfrontSection({ flentUpfront, tradUpfront }: UpfrontSectionProps) {
  const upfrontDelta = tradUpfront - flentUpfront;
  const flentNeedsLessUpfront = upfrontDelta > 0;

  return (
    <section className="mb-5 rounded-2xl bg-forest-green p-5">
      <div>
        <div className="mb-1 font-zin text-fluid-h1 text-bg-white">
          {formatCurrency(Math.abs(upfrontDelta))}
        </div>
        <p className="mb-3 text-subtitle-sm font-body text-bg-white/80">
          {flentNeedsLessUpfront
            ? "less cash needed upfront with Flent"
            : "more cash needed upfront with Flent"}
        </p>
        <p className="max-w-xl text-subtitle-sm font-body text-bg-white/85">
          Traditional renting costs{" "}
          <span className="font-bold text-bg-white">{formatCurrency(tradUpfront)}</span> as you
          would have to pay a higher deposit, fixed brokerage and for furnishing.
        </p>
      </div>
    </section>
  );
}
