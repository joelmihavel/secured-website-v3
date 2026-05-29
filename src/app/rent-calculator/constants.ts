import type { SpendIdea } from "./types";

export const AREA_DEFAULTS: Record<string, number> = {
  "HSR Layout": 35000,
  Koramangala: 40000,
  Indiranagar: 42000,
  Bellandur: 32000,
  "Sarjapur Road": 30000,
  Whitefield: 30000,
  Marathahalli: 28000,
};

export const DURATION = 11;
export const TRAD_ROOM_FACTOR = 0.7;
export const TRAD_1BHK_FACTOR = 1.2;
export const TRAD_MAINT_FACTOR = 0.05;
export const DEPOSIT_MONTHS_TRAD = 6;
export const FLENT_DEPOSIT_MULT = 3;
export const FLENT_EXIT_FEE = 10000;
export const TRAD_PAINTING = 30000;
export const FURN_RENT_MO = 6000;
export const FURN_BUY = 150000;
export const FURN_DEPRECIATION = 0.5;
export const ESSENTIALS = 20000;
export const OPP_RATE = 0.12;
export const VACANCY_DAYS = 10;
export const VACANCY_DAILY = 1000;

export const SPEND_IDEAS: SpendIdea[] = [
  { emoji: "📱", label: "iPhone 16", cost: 80000 },
  { emoji: "✈️", label: "Bali trip for 2", cost: 65000 },
  { emoji: "⌚", label: "Apple Watch SE", cost: 30000 },
  { emoji: "🎧", label: "AirPods Pro", cost: 25000 },
  { emoji: "💪", label: "6 months of gym", cost: 18000 },
  { emoji: "🏖️", label: "Goa weekend for 2", cost: 15000 },
  { emoji: "🎬", label: "Year of streaming", cost: 10000 },
];
