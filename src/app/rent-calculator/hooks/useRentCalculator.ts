"use client";

import { useMemo, useState } from "react";
import {
  AREA_DEFAULTS,
  DEPOSIT_MONTHS_TRAD,
  DURATION,
  ESSENTIALS,
  FLENT_DEPOSIT_MULT,
  FLENT_EXIT_FEE,
  FURN_BUY,
  FURN_DEPRECIATION,
  FURN_RENT_MO,
  OPP_RATE,
  SPEND_IDEAS,
  TRAD_1BHK_FACTOR,
  TRAD_MAINT_FACTOR,
  TRAD_PAINTING,
  TRAD_ROOM_FACTOR,
  VACANCY_DAILY,
  VACANCY_DAYS,
} from "../constants";
import type { ComparisonMode, FurnitureMode } from "../types";
import type { RentCalculatorUrlStateOverrides } from "../utils/urlState";

const DEFAULT_AREA = "HSR Layout";
const DEFAULT_MODE: ComparisonMode = "roommate";
const DEFAULT_FURNITURE_MODE: FurnitureMode = "rent";

const toNonNegativeRoundedNumber = (value: number): number => Math.max(0, Math.round(value));

export const useRentCalculator = (initialState?: RentCalculatorUrlStateOverrides) => {
  const initialMode = initialState?.mode ?? DEFAULT_MODE;
  const requestedInitialArea = initialState?.area ?? DEFAULT_AREA;
  const initialArea = Object.prototype.hasOwnProperty.call(AREA_DEFAULTS, requestedInitialArea)
    ? requestedInitialArea
    : DEFAULT_AREA;
  const initialFurnitureMode = initialState?.furnitureMode ?? DEFAULT_FURNITURE_MODE;

  const initialFlentRent = toNonNegativeRoundedNumber(
    initialState?.flentRent ?? AREA_DEFAULTS[initialArea]
  );
  const initialTradRent = toNonNegativeRoundedNumber(
    initialState?.tradRent ??
      Math.round(initialFlentRent * (initialMode === "1bhk" ? TRAD_1BHK_FACTOR : TRAD_ROOM_FACTOR))
  );
  const initialTradMaint = toNonNegativeRoundedNumber(
    initialState?.tradMaint ?? Math.round(initialTradRent * TRAD_MAINT_FACTOR)
  );
  const initialTradDeposit = toNonNegativeRoundedNumber(
    initialState?.tradDeposit ?? initialTradRent * DEPOSIT_MONTHS_TRAD
  );
  const initialTradBrokerage = toNonNegativeRoundedNumber(initialState?.tradBrokerage ?? initialTradRent);
  const initialTradPainting = toNonNegativeRoundedNumber(initialState?.tradPainting ?? TRAD_PAINTING);

  const [area, setArea] = useState(initialArea);
  const [mode, setMode] = useState<ComparisonMode>(initialMode);
  const [furnitureMode, setFurnitureMode] = useState<FurnitureMode>(initialFurnitureMode);
  const [flentRent, setFlentRent] = useState(initialFlentRent);
  const [tradRent, setTradRent] = useState(initialTradRent);
  const [tradMaint, setTradMaint] = useState(initialTradMaint);
  const [tradDeposit, setTradDeposit] = useState(initialTradDeposit);
  const [tradBrokerage, setTradBrokerage] = useState(initialTradBrokerage);
  const [tradPainting, setTradPainting] = useState(initialTradPainting);

  const derivedTradRent = Math.round(
    mode === "1bhk" ? flentRent * TRAD_1BHK_FACTOR : flentRent * TRAD_ROOM_FACTOR
  );

  const effTradRent = tradRent;
  const effMaint = tradMaint;
  const effDeposit = tradDeposit;
  const effBrokerage = tradBrokerage;

  const resetInputsFromAreaAndMode = (nextArea: string, nextMode: ComparisonMode) => {
    setFlentRent(AREA_DEFAULTS[nextArea]);
    const nextTradRent = Math.round(
      AREA_DEFAULTS[nextArea] * (nextMode === "1bhk" ? TRAD_1BHK_FACTOR : TRAD_ROOM_FACTOR)
    );
    setTradRent(nextTradRent);
    setTradMaint(Math.round(nextTradRent * TRAD_MAINT_FACTOR));
    setTradDeposit(nextTradRent * DEPOSIT_MONTHS_TRAD);
    setTradBrokerage(nextTradRent);
    setTradPainting(TRAD_PAINTING);
  };

  const handleSetArea = (nextArea: string) => {
    if (nextArea === area) return;
    setArea(nextArea);
    resetInputsFromAreaAndMode(nextArea, mode);
  };

  const handleSetMode = (nextMode: ComparisonMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    resetInputsFromAreaAndMode(area, nextMode);
  };

  const calculations = useMemo(() => {
    const flentDeposit = flentRent * FLENT_DEPOSIT_MULT;
    const flentRentTotal = flentRent * DURATION;
    const flentDepositOpp = Math.round((flentDeposit * OPP_RATE * DURATION) / 12);
    const flentTotal = flentRentTotal + FLENT_EXIT_FEE + flentDepositOpp;
    const flentUpfront = flentDeposit + flentRent;

    const tradFurnBuyCost = Math.round(FURN_BUY * FURN_DEPRECIATION);
    const tradFurnBuyMo = Math.round(tradFurnBuyCost / DURATION);
    const tradFurniture =
      furnitureMode === "rent"
        ? FURN_RENT_MO * DURATION + ESSENTIALS
        : tradFurnBuyCost + ESSENTIALS;
    const tradFurnMo = furnitureMode === "rent" ? FURN_RENT_MO : 0;
    const tradMonthly = effTradRent + effMaint + tradFurnMo;
    const tradRentMaintTotal = (effTradRent + effMaint) * DURATION;
    const tradDepositOpp = Math.round((effDeposit * OPP_RATE * DURATION) / 12);
    const tradVacancy = mode === "roommate" ? VACANCY_DAYS * VACANCY_DAILY : 0;
    const tradTotal =
      tradRentMaintTotal +
      effBrokerage +
      tradPainting +
      tradFurniture +
      tradDepositOpp +
      tradVacancy;
    const tradUpfront =
      effDeposit +
      effBrokerage +
      (furnitureMode === "buy" ? FURN_BUY + ESSENTIALS : ESSENTIALS) +
      tradMonthly;

    const savings = tradTotal - flentTotal;
    const flentWins = savings > 0;
    const isRentLow = effTradRent < derivedTradRent;
    const affordItems = SPEND_IDEAS.filter((item) => item.cost <= Math.abs(savings)).slice(0, 3);

    return {
      flentDeposit,
      flentDepositOpp,
      flentTotal,
      flentUpfront,
      tradFurnBuyCost,
      tradFurnBuyMo,
      tradFurniture,
      tradMonthly,
      tradDepositOpp,
      tradVacancy,
      tradTotal,
      tradUpfront,
      savings,
      flentWins,
      isRentLow,
      affordItems,
    };
  }, [derivedTradRent, effBrokerage, effDeposit, effMaint, effTradRent, flentRent, furnitureMode, mode, tradPainting]);

  return {
    area,
    setArea: handleSetArea,
    mode,
    setMode: handleSetMode,
    furnitureMode,
    setFurnitureMode,
    flentRent,
    setFlentRent,
    tradPainting,
    setTradPainting,
    effTradRent,
    setTradRent,
    effMaint,
    setTradMaint,
    effDeposit,
    setTradDeposit,
    effBrokerage,
    setTradBrokerage,
    calculations,
  };
};
