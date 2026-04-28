import { AREA_DEFAULTS } from "../constants";
import type { ComparisonMode, FurnitureMode } from "../types";

export const CALCULATOR_QUERY_PARAM_KEYS = [
  "m",
  "a",
  "fm",
  "fr",
  "tr",
  "tm",
  "td",
  "tb",
  "tp",
] as const;

type CalculatorQueryParamKey = (typeof CALCULATOR_QUERY_PARAM_KEYS)[number];

export type RentCalculatorUrlState = {
  mode: ComparisonMode;
  area: string;
  furnitureMode: FurnitureMode;
  flentRent: number;
  tradRent: number;
  tradMaint: number;
  tradDeposit: number;
  tradBrokerage: number;
  tradPainting: number;
};

export type RentCalculatorUrlStateOverrides = Partial<RentCalculatorUrlState>;

const CALCULATOR_QUERY_PARAM_KEY_SET = new Set<string>(CALCULATOR_QUERY_PARAM_KEYS);
const VALID_MODES: readonly ComparisonMode[] = ["roommate", "1bhk"];
const VALID_FURNITURE_MODES: readonly FurnitureMode[] = ["rent", "buy"];

const isValidMode = (value: string | null): value is ComparisonMode =>
  value !== null && VALID_MODES.includes(value as ComparisonMode);

const isValidFurnitureMode = (value: string | null): value is FurnitureMode =>
  value !== null && VALID_FURNITURE_MODES.includes(value as FurnitureMode);

const isValidArea = (value: string | null): value is string =>
  value !== null && Object.prototype.hasOwnProperty.call(AREA_DEFAULTS, value);

const parseOptionalNonNegativeNumber = (value: string | null): number | undefined => {
  if (value === null) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.max(0, Math.round(parsed));
};

const appendSortedUnknownParams = (
  target: URLSearchParams,
  source: URLSearchParams | ReadonlyURLSearchParams
) => {
  const unknownEntries: Array<[key: string, value: string]> = [];
  for (const [key, value] of source.entries()) {
    if (!CALCULATOR_QUERY_PARAM_KEY_SET.has(key)) {
      unknownEntries.push([key, value]);
    }
  }
  unknownEntries.sort(([a], [b]) => a.localeCompare(b));
  for (const [key, value] of unknownEntries) {
    target.append(key, value);
  }
};

type ReadonlyURLSearchParams = Pick<URLSearchParams, "get" | "entries">;

export const parseCalculatorStateFromSearchParams = (
  searchParams: ReadonlyURLSearchParams
): RentCalculatorUrlStateOverrides => {
  const modeParam = searchParams.get("m");
  const areaParam = searchParams.get("a");
  const furnitureModeParam = searchParams.get("fm");

  return {
    mode: isValidMode(modeParam) ? modeParam : undefined,
    area: isValidArea(areaParam) ? areaParam : undefined,
    furnitureMode: isValidFurnitureMode(furnitureModeParam) ? furnitureModeParam : undefined,
    flentRent: parseOptionalNonNegativeNumber(searchParams.get("fr")),
    tradRent: parseOptionalNonNegativeNumber(searchParams.get("tr")),
    tradMaint: parseOptionalNonNegativeNumber(searchParams.get("tm")),
    tradDeposit: parseOptionalNonNegativeNumber(searchParams.get("td")),
    tradBrokerage: parseOptionalNonNegativeNumber(searchParams.get("tb")),
    tradPainting: parseOptionalNonNegativeNumber(searchParams.get("tp")),
  };
};

export const serializeCalculatorStateToSearchParams = (
  state: RentCalculatorUrlState
): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("m", state.mode);
  params.set("a", state.area);
  params.set("fm", state.furnitureMode);
  params.set("fr", String(Math.max(0, Math.round(state.flentRent))));
  params.set("tr", String(Math.max(0, Math.round(state.tradRent))));
  params.set("tm", String(Math.max(0, Math.round(state.tradMaint))));
  params.set("td", String(Math.max(0, Math.round(state.tradDeposit))));
  params.set("tb", String(Math.max(0, Math.round(state.tradBrokerage))));
  params.set("tp", String(Math.max(0, Math.round(state.tradPainting))));
  return params;
};

export const toCanonicalCalculatorSearchParams = (
  state: RentCalculatorUrlState,
  existingSearchParams?: URLSearchParams | ReadonlyURLSearchParams
): URLSearchParams => {
  const canonicalParams = serializeCalculatorStateToSearchParams(state);
  if (!existingSearchParams) return canonicalParams;
  appendSortedUnknownParams(canonicalParams, existingSearchParams);
  return canonicalParams;
};

export const isCalculatorQueryParamKey = (key: string): key is CalculatorQueryParamKey =>
  CALCULATOR_QUERY_PARAM_KEY_SET.has(key);
