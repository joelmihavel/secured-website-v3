// Single source of truth for renewal pricing on flent.in.
//
// Discount ladder: 30 / 50 / 70% off the escalation for 6 / 9 / 11-month
// lock-in. The lock-in is the *early-exit penalty window* — every renewal
// agreement runs for 11 months, so term savings = monthly savings × 11 for
// every tier.
//
// Mirrors `flent-renewals/lib/pricing.ts` (Chetan's app). Keep these in sync.

export const ESCALATION_DISCOUNTS = {
  no_lockin: 0,
  "6_months": 0.30,
  "9_months": 0.50,
  "11_months": 0.70,
} as const;

export type TierKey = keyof typeof ESCALATION_DISCOUNTS;

export const TIER_META: Record<TierKey, { label: string; lockMonths: number; copy: string }> = {
  no_lockin: { label: "No lock-in", lockMonths: 0, copy: "Flexible · leave anytime with 30-day notice" },
  "6_months": { label: "6-month lock", lockMonths: 6, copy: "30% off escalation" },
  "9_months": { label: "9-month lock", lockMonths: 9, copy: "50% off escalation" },
  "11_months": { label: "11-month lock", lockMonths: 11, copy: "70% off escalation · best value" },
};

export type TierQuote = {
  key: TierKey;
  label: string;
  lockMonths: number;
  discountPct: number;
  escalationAmount: number;
  discountAmount: number;
  newRent: number;
  monthlySavings: number;
  termSavings: number;
  annualSavings: number;
};

// Agreement length is always 11 months. The lock-in (6/9/11) is the
// early-exit penalty window, not the agreement duration.
const AGREEMENT_MONTHS = 11;

export function quoteAll(currentRent: number, escalationPct: number): TierQuote[] {
  const escalationAmount = round(currentRent * escalationPct);
  const baseEscalated = currentRent + escalationAmount;

  return (Object.keys(ESCALATION_DISCOUNTS) as TierKey[]).map((key) => {
    const discountPct = ESCALATION_DISCOUNTS[key];
    const discountAmount = round(escalationAmount * discountPct);
    const newRent = baseEscalated - discountAmount;
    const monthlySavings = round(baseEscalated - newRent);
    const lockMonths = TIER_META[key].lockMonths;
    return {
      key,
      label: TIER_META[key].label,
      lockMonths,
      discountPct,
      escalationAmount,
      discountAmount,
      newRent,
      monthlySavings,
      termSavings: monthlySavings * AGREEMENT_MONTHS,
      annualSavings: monthlySavings * 12,
    };
  });
}

export function quoteFor(currentRent: number, escalationPct: number, key: TierKey): TierQuote {
  const q = quoteAll(currentRent, escalationPct).find((x) => x.key === key);
  if (!q) throw new Error(`Unknown tier: ${key}`);
  return q;
}

export const VALID_TIERS: TierKey[] = ["no_lockin", "6_months", "9_months", "11_months"];

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

function round(n: number) {
  return Math.round(n);
}
