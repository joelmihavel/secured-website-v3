"use client";

import { useState } from "react";
import { CircleAlert, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComparisonRow } from "../components/primitives/ComparisonRow";
import { EditCell } from "../components/primitives/EditCell";
import { MobileComparisonCard } from "../components/primitives/MobileComparisonCard";
import { GuidedNavigationTooltip } from "../components/primitives/guidedNavigationTooltip";
import {
  DEPOSIT_MONTHS_TRAD,
  DURATION,
  ESSENTIALS,
  FLENT_EXIT_FEE,
  FURN_BUY,
  FURN_RENT_MO,
  VACANCY_DAILY,
  VACANCY_DAYS,
} from "../constants";
import type { ComparisonMode, FurnitureMode } from "../types";
import { formatCurrency } from "../utils";
import type { RentCalculatorInputName } from "@/lib/posthog-tracking";

type ComparisonTableSectionProps = {
  area: string;
  mode: ComparisonMode;
  furnitureMode: FurnitureMode;
  setFurnitureMode: (mode: FurnitureMode) => void;
  flentRent: number;
  setFlentRent: (value: number) => void;
  effTradRent: number;
  setTradRent: (value: number) => void;
  effMaint: number;
  setTradMaint: (value: number) => void;
  effDeposit: number;
  setTradDeposit: (value: number) => void;
  effBrokerage: number;
  setTradBrokerage: (value: number) => void;
  tradPainting: number;
  setTradPainting: (value: number) => void;
  onInputCommit: (
    inputName: RentCalculatorInputName,
    newValue: number,
    previousValue: number
  ) => void;
  minFlentRentInArea: number | null;
  isFlentRentBelowAreaMin: boolean;
  isRentLow: boolean;
  flentDeposit: number;
  tradFurnBuyCost: number;
  tradFurnBuyMo: number;
  tradVacancy: number;
  flentDepositOpp: number;
  tradDepositOpp: number;
  tradMonthly: number;
  flentTotal: number;
  tradTotal: number;
};

const SectionHeader = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => (
  <TableRow className={`border-b-0 ${className ?? ""}`}>
    <TableCell colSpan={3} className="px-4 py-2">
      <div className="text-xs font-extrabold uppercase tracking-widest text-ground-brown">
        {title}
      </div>
    </TableCell>
  </TableRow>
);

// Spacer that provides 16px "wrapper padding" within a table block.
const SectionPaddingRow = ({ withTopBorder = false }: { withTopBorder?: boolean }) => (
  <TableRow className="border-b-0">
    <TableCell colSpan={3} className={`p-0 ${withTopBorder ? "border-t-2 border-border" : ""}`}>
      <div className="h-4" />
    </TableCell>
  </TableRow>
);

const MobileSectionHeader = ({ title }: { title: string }) => (
  <div className="pt-1 text-center text-xs font-extrabold uppercase tracking-widest text-ground-brown">
    {title}
  </div>
);

type ActivePanel = "flent" | "trad" | null;

type MonthlyTooltipConfigContext = {
  selectedArea: string;
  mode: ComparisonMode;
  isRentLow: boolean;
  flentRent: number;
  minFlentRentInArea: number | null;
  isFlentRentBelowAreaMin: boolean;
  onUpdateFlentRentToAreaFloor: () => void;
};

type MonthlyTooltipConfigState = {
  content: ReactNode;
  contentClassName?: string;
};

const LOW_RENT_WARNING_TEXT =
  "This may not be a Flent-standard home. The locality, size, or building quality could be a compromise.";

const renderTooltipWithEditIcon = (text: string, textClassName: string, iconClassName: string) => (
  <div className="flex items-start gap-2">
    <div className={`mt-0.5 ${iconClassName}`}>
      <Pencil className="size-4" aria-hidden="true" />
    </div>
    <p className={`text-subtitle-sm ${textClassName}`}>{text}</p>
  </div>
);

const FURNISHING_TOOLTIP_TEXT =
  "Every Flent home comes fully set up, from spoons to a washing machine. Just walk in and start living.";

const renderFurnishingTooltipContent = () => (
  <p className="text-subtitle-sm text-text-main">{FURNISHING_TOOLTIP_TEXT}</p>
);

const monthlyTooltipConfig = {
  flent: {
    ariaLabel: "How Flent monthly rent is estimated",
    getState: ({
      selectedArea,
      flentRent,
      minFlentRentInArea,
      isFlentRentBelowAreaMin,
      onUpdateFlentRentToAreaFloor,
    }: MonthlyTooltipConfigContext): MonthlyTooltipConfigState => {
      if (isFlentRentBelowAreaMin && minFlentRentInArea !== null) {
        return {
          content: (
            <div className="space-y-3">
              <p className="text-subtitle-sm text-text-invert">
                We don’t currently have homes starting at {formatCurrency(flentRent)} in{" "}
                {selectedArea}. Homes here start at {formatCurrency(minFlentRentInArea)}. Switch to
                that instead?
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onUpdateFlentRentToAreaFloor}
                data-cta-id="rent_calculator_flent_floor_update"
                data-cta-context="rent_calculator_flent_floor_tooltip"
                className="h-8 border-text-invert/80 px-3 py-1.5 text-text-invert hover:bg-text-invert/10"
              >
                Update
              </Button>
            </div>
          ),
          contentClassName: "bg-brick-red text-text-invert border-brick-red",
        };
      }

      return {
        content: renderTooltipWithEditIcon(
          `Average rent of a flent home in ${selectedArea}, feel free to edit`,
          "text-text-main",
          "text-text-main/70"
        ),
      };
    },
  },
  traditional: {
    ariaLabel: "How traditional monthly rent is estimated",
    getState: ({ selectedArea, mode, isRentLow }: MonthlyTooltipConfigContext): MonthlyTooltipConfigState => {
      if (isRentLow) {
        return {
          content: renderTooltipWithEditIcon(
            LOW_RENT_WARNING_TEXT,
            "text-text-invert",
            "text-text-invert/80"
          ),
          contentClassName: "bg-brick-red text-text-invert border-brick-red",
        };
      }

      const text =
        mode === "roommate"
          ? `Enter your share of the monthly rent for a home in ${selectedArea}`
          : `Enter the monthly rent for a home in ${selectedArea}`;

      return {
        content: renderTooltipWithEditIcon(text, "text-text-main", "text-text-main/70"),
      };
    },
  },
} as const;

export function ComparisonTableSection(props: ComparisonTableSectionProps) {
  const {
    area,
    mode,
    furnitureMode,
    setFurnitureMode,
    flentRent,
    setFlentRent,
    effTradRent,
    setTradRent,
    effMaint,
    setTradMaint,
    effDeposit,
    setTradDeposit,
    effBrokerage,
    setTradBrokerage,
    tradPainting,
    setTradPainting,
    onInputCommit,
    minFlentRentInArea,
    isFlentRentBelowAreaMin,
    isRentLow,
    flentDeposit,
    tradFurnBuyCost,
    tradFurnBuyMo,
    tradVacancy,
    flentDepositOpp,
    tradDepositOpp,
    tradMonthly,
    flentTotal,
    tradTotal,
  } = props;

  const [rentActivePanel, setRentActivePanel] = useState<ActivePanel>(null);
  const [maintenanceActivePanel, setMaintenanceActivePanel] = useState<ActivePanel>(null);
  const [depositActivePanel, setDepositActivePanel] = useState<ActivePanel>(null);
  const [brokerageActivePanel, setBrokerageActivePanel] = useState<ActivePanel>(null);
  const [paintingActivePanel, setPaintingActivePanel] = useState<ActivePanel>(null);
  const monthlyTooltipContext: MonthlyTooltipConfigContext = {
    selectedArea: area,
    mode,
    isRentLow,
    flentRent,
    minFlentRentInArea,
    isFlentRentBelowAreaMin,
    onUpdateFlentRentToAreaFloor: () => {
      if (minFlentRentInArea === null) return;
      setFlentRent(minFlentRentInArea);
    },
  };
  const flentRentTooltip = monthlyTooltipConfig.flent.getState(monthlyTooltipContext);
  const traditionalRentTooltip = monthlyTooltipConfig.traditional.getState(monthlyTooltipContext);

  return (
    <section id="rent-calculator-comparison" className="mb-5">
      <div className="space-y-4 md:hidden">
        <div className="space-y-4">
          <MobileSectionHeader title="Monthly Costs" />
          <div className="space-y-3">
            <MobileComparisonCard
          label="Rent"
          activePanel={rentActivePanel}
          flentInteractive
          tradInteractive
          flent={
            <GuidedNavigationTooltip
              ariaLabel={monthlyTooltipConfig.flent.ariaLabel}
              content={flentRentTooltip.content}
              contentClassName={flentRentTooltip.contentClassName}
              autoOpenOnVisible
            >
              <EditCell
                value={flentRent}
                onChange={setFlentRent}
                variant="mobileFlat"
                onFocusChange={(isFocused) => setRentActivePanel(isFocused ? "flent" : null)}
                onCommit={(newValue, previousValue) =>
                  onInputCommit("flent_rent", newValue, previousValue)
                }
                inputClassName={`!w-full max-w-32 ${
                  isFlentRentBelowAreaMin ? "!border-brick-red focus:!border-brick-red" : ""
                }`}
              />
            </GuidedNavigationTooltip>
          }
          trad={
            <GuidedNavigationTooltip
              ariaLabel={monthlyTooltipConfig.traditional.ariaLabel}
              content={traditionalRentTooltip.content}
              contentClassName={traditionalRentTooltip.contentClassName}
              autoOpenOnVisible
            >
              <EditCell
                value={effTradRent}
                onChange={setTradRent}
                variant="mobileFlat"
                onFocusChange={(isFocused) => setRentActivePanel(isFocused ? "trad" : null)}
                onCommit={(newValue, previousValue) =>
                  onInputCommit("traditional_rent", newValue, previousValue)
                }
                inputClassName={`!w-full max-w-32 ${
                  isRentLow ? "!border-brick-red focus:!border-brick-red" : ""
                }`}
              />
            </GuidedNavigationTooltip>
          }
            />

            <MobileComparisonCard
          label="Maintenance"
          sub="Society + common area"
          activePanel={maintenanceActivePanel}
          tradInteractive
          flent={<span className="text-base font-bold text-forest-green">Inclusive</span>}
          trad={
            <EditCell
              value={effMaint}
              onChange={setTradMaint}
              variant="mobileFlat"
              onFocusChange={(isFocused) => setMaintenanceActivePanel(isFocused ? "trad" : null)}
              onCommit={(newValue, previousValue) =>
                onInputCommit("traditional_maintenance", newValue, previousValue)
              }
              inputClassName="!w-full max-w-32"
            />
          }
            />

            <MobileComparisonCard
          label="Furnishing"
          labelAccessory={
            <Tabs
              value={furnitureMode}
              onValueChange={(value) => setFurnitureMode(value as FurnitureMode)}
              variant="pill"
              className="w-44 shrink-0"
            >
              <TabsList className="flex w-full">
                <TabsTrigger value="rent" className="w-1/2 flex-1 px-0 py-1.5 text-xs">
                  Rent
                </TabsTrigger>
                <TabsTrigger value="buy" className="w-1/2 flex-1 px-0 py-1.5 text-xs">
                  Buy
                </TabsTrigger>
              </TabsList>
            </Tabs>
          }
          flent={
            <div className="inline-flex items-center gap-1.5">
              <span className="text-base font-bold text-forest-green">200+ items included</span>
              <GuidedNavigationTooltip
                ariaLabel="What is included in Flent furnishing"
                content={renderFurnishingTooltipContent()}
                contentClassName="bg-bg-white text-text-main border-border"
              >
                <CircleAlert className="size-4 text-text-main/70" />
              </GuidedNavigationTooltip>
            </div>
          }
          trad={
            <div>
              {furnitureMode === "rent" ? (
                <>
                  <div className="text-base font-bold text-text-main">{formatCurrency(FURN_RENT_MO)}/mo</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    8 items via Furlenco, Rentomojo
                  </div>
                </>
              ) : (
                <>
                  <div className="text-base font-bold text-text-main">{formatCurrency(FURN_BUY)} upfront</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">~15 items purchased</div>
                </>
              )}
            </div>
          }
            />
          </div>

          <div className="rounded-lg border-2 border-border bg-brand-yellow px-4 py-4 text-center">
            <div className="mb-3.5">
            <div className="text-sm font-semibold text-text-main">Effective Monthly Cost</div>
            <div className="mt-1 text-xs font-medium text-text-main/70">{DURATION} month lease</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg px-0 py-1 text-center">
                <div className="font-zin text-4xl leading-none text-text-main">{formatCurrency(flentRent)}</div>
              </div>
              <div className="rounded-lg px-0 py-1 text-center">
                <div className="font-zin text-4xl leading-none text-text-main/80">
                  {formatCurrency(tradMonthly)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <MobileSectionHeader title="One-Time & Hidden Costs" />
          <div className="space-y-3">

            <MobileComparisonCard
          label="Security Deposit"
          activePanel={depositActivePanel}
          tradInteractive
          flent={
            <div>
              <span className="font-bold text-text-main">{formatCurrency(flentDeposit)}</span>
              <div className="text-xs text-muted-foreground">3 months&apos; rent</div>
            </div>
          }
          trad={
            <div>
              <EditCell
                value={effDeposit}
                onChange={setTradDeposit}
                variant="mobileFlat"
                onFocusChange={(isFocused) => setDepositActivePanel(isFocused ? "trad" : null)}
                onCommit={(newValue, previousValue) =>
                  onInputCommit("traditional_deposit", newValue, previousValue)
                }
                inputClassName="!w-full max-w-32"
              />
              <div className="mt-0.5 text-xs text-muted-foreground">
                {DEPOSIT_MONTHS_TRAD} months typical
              </div>
            </div>
          }
            />

            <MobileComparisonCard
          label="Brokerage"
          activePanel={brokerageActivePanel}
          tradInteractive
          flent={<span className="text-base font-bold text-forest-green">Zero, always!</span>}
          trad={
            <div>
              <EditCell
                value={effBrokerage}
                onChange={setTradBrokerage}
                variant="mobileFlat"
                onFocusChange={(isFocused) => setBrokerageActivePanel(isFocused ? "trad" : null)}
                onCommit={(newValue, previousValue) =>
                  onInputCommit("traditional_brokerage", newValue, previousValue)
                }
                inputClassName="!w-full max-w-32"
              />
              <div className="mt-0.5 text-xs text-muted-foreground">1 month rent typical</div>
            </div>
          }
            />

            <MobileComparisonCard
          label="Essentials"
          sub="Kitchenware, curtains, bedding"
          flent={<span className="text-base font-bold text-forest-green">Included</span>}
          trad={
            <div>
              <span className="text-base font-bold text-text-main">
                {formatCurrency(ESSENTIALS)}
              </span>
              <div className="text-xs text-muted-foreground">Can&apos;t rent these</div>
            </div>
          }
            />

            {furnitureMode === "buy" ? (
              <MobileComparisonCard
            label="Furniture Depreciation"
            sub="Value lost over 11 months"
            flent={<span className="text-base font-bold text-forest-green">No furniture to lose</span>}
            trad={
              <div className="mx-auto max-w-40">
                <div className="mb-0.5 flex justify-between text-xs">
                  <span className="text-muted-foreground">Purchased</span>
                  <span className="font-bold text-text-main">{formatCurrency(FURN_BUY)}</span>
                </div>
                <div className="mb-0.5 flex justify-between text-xs">
                  <span className="text-muted-foreground">Resale (11mo)</span>
                  <span className="font-bold text-text-main">
                    {formatCurrency(FURN_BUY - tradFurnBuyCost)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 text-xs">
                  <span className="font-bold text-brick-red">Value lost</span>
                  <span className="font-extrabold text-brick-red">{formatCurrency(tradFurnBuyCost)}</span>
                </div>
                <div className="mt-1 text-xs font-bold text-brick-red">
                  = {formatCurrency(tradFurnBuyMo)}/mo effective cost
                </div>
              </div>
            }
              />
            ) : null}

            <MobileComparisonCard
          label="Exit / Painting"
          activePanel={paintingActivePanel}
          tradInteractive
          flent={
            <div>
              <span className="font-bold text-text-main">{formatCurrency(FLENT_EXIT_FEE)}</span>
              <div className="text-xs text-muted-foreground">Fixed exit fee</div>
            </div>
          }
          trad={
            <div>
              <EditCell
                value={tradPainting}
                onChange={setTradPainting}
                variant="mobileFlat"
                onFocusChange={(isFocused) => setPaintingActivePanel(isFocused ? "trad" : null)}
                onCommit={(newValue, previousValue) =>
                  onInputCommit("traditional_painting", newValue, previousValue)
                }
                inputClassName="!w-full max-w-32"
              />
              <div className="mt-0.5 text-xs text-muted-foreground">+ surprise deductions</div>
            </div>
          }
            />

            {mode === "roommate" ? (
              <MobileComparisonCard
            label="Flatmate Vacancy"
            sub="~10 days to find flatmates"
            flent={
              <span className="text-base font-bold text-forest-green">Not needed</span>
            }
            trad={
              <div>
                <span className="text-base font-bold text-brick-red">
                  {formatCurrency(tradVacancy)}
                </span>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(VACANCY_DAILY)}/day × ~{VACANCY_DAYS} days
                </div>
              </div>
            }
              />
            ) : null}

            <MobileComparisonCard
          label="Deposit Opportunity Cost"
          sub="Returns lost @ 12% p.a."
          flent={<span className="text-base font-bold text-text-main">{formatCurrency(flentDepositOpp)}</span>}
          trad={<span className="text-base font-bold text-text-main">{formatCurrency(tradDepositOpp)}</span>}
            />
          </div>

          <div className="rounded-lg border-2 border-border bg-forest-green px-4 py-4 text-center">
            <div className="mb-3.5">
            <div className="text-sm font-semibold text-text-invert">Grand Total Cost</div>
            <div className="mt-1 text-xs font-medium text-text-invert/80">{DURATION} month lease</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg px-0 py-1 text-center">
                <div className="font-zin text-4xl leading-none text-text-invert">
                  {formatCurrency(flentTotal)}
                </div>
              </div>
              <div className="rounded-lg px-0 py-1 text-center">
                <div className="font-zin text-4xl leading-none text-text-invert/90">
                  {formatCurrency(tradTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <section className="hidden overflow-hidden rounded-3xl border-2 border-border bg-bg-white md:block">
      <Table className="border-0">
        <TableHeader className="font-heading">
          <TableRow>
            <TableHead className="bg-secondary-background px-4 py-3.5 text-foreground">
                <div className="font-zin text-base font-bold tracking-widest text-text-main/60 md:text-lg">
                Costs
              </div>
            </TableHead>
            <TableHead className="bg-secondary-background px-2.5 py-3.5 text-center text-foreground">
                <div className="font-zin text-base font-bold tracking-widest text-forest-green md:text-lg">
                Flent
              </div>
            </TableHead>
            <TableHead className="bg-secondary-background px-2.5 py-3.5 text-center text-foreground">
                <div className="font-zin text-base font-bold tracking-widest text-text-main/70 md:text-lg">
                Traditional Renting
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SectionPaddingRow />

          <SectionHeader title="Monthly Costs" />

          <SectionPaddingRow />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Rent"
            flent={
              <GuidedNavigationTooltip
                ariaLabel={monthlyTooltipConfig.flent.ariaLabel}
                content={flentRentTooltip.content}
                contentClassName={flentRentTooltip.contentClassName}
                forceOpen={isFlentRentBelowAreaMin}
                autoOpenOnVisible
              >
                <EditCell
                  value={flentRent}
                  onChange={setFlentRent}
                  variant="mobileFlat"
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("flent_rent", newValue, previousValue)
                  }
                  inputClassName={
                    isFlentRentBelowAreaMin ? "!border-brick-red focus:!border-brick-red" : undefined
                  }
                />
              </GuidedNavigationTooltip>
            }
            trad={
              <GuidedNavigationTooltip
                ariaLabel={monthlyTooltipConfig.traditional.ariaLabel}
                content={traditionalRentTooltip.content}
                contentClassName={traditionalRentTooltip.contentClassName}
                forceOpen={isRentLow}
                autoOpenOnVisible
              >
                <EditCell
                  value={effTradRent}
                  onChange={setTradRent}
                  variant="mobileFlat"
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_rent", newValue, previousValue)
                  }
                  inputClassName={isRentLow ? "!border-brick-red focus:!border-brick-red" : undefined}
                />
              </GuidedNavigationTooltip>
            }
          />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Maintenance"
            divider
            sub="Society + common area"
            flent={<span className="text-base font-bold text-forest-green">Inclusive</span>}
            trad={
              <div>
                <EditCell
                  value={effMaint}
                  onChange={setTradMaint}
                  variant="mobileFlat"
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_maintenance", newValue, previousValue)
                  }
                />
              </div>
            }
          />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Furnishing"
            divider
            flent={
              <div className="inline-flex items-center gap-1.5">
                <span className="text-base font-bold text-forest-green">
                  200+ items included
                </span>
                <GuidedNavigationTooltip
                  ariaLabel="What is included in Flent furnishing"
                  content={renderFurnishingTooltipContent()}
                  contentClassName="bg-bg-white text-text-main border-border"
                >
                  <CircleAlert className="size-4 text-text-main/70" />
                </GuidedNavigationTooltip>
              </div>
            }
            trad={
              <div>
                <Tabs
                  value={furnitureMode}
                  onValueChange={(value) => setFurnitureMode(value as FurnitureMode)}
                  variant="pill"
                  className="mx-auto mb-1.5 w-full max-w-44"
                >
                  <TabsList className="flex w-full">
                    <TabsTrigger value="rent" className="w-1/2 flex-1 px-0 py-1.5 text-xs">
                      Rent
                    </TabsTrigger>
                    <TabsTrigger value="buy" className="w-1/2 flex-1 px-0 py-1.5 text-xs">
                      Buy
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {furnitureMode === "rent" ? (
                  <>
                    <div className="text-base font-bold text-text-main">
                      {formatCurrency(FURN_RENT_MO)}/mo
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      8 items via Furlenco, Rentomojo
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-base font-bold text-text-main">
                      {formatCurrency(FURN_BUY)} upfront
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">~15 items purchased</div>
                  </>
                )}
              </div>
            }
          />

          <TableRow className="border-b-0 bg-pastel-orange">
            <TableCell className="border-t-2 border-border px-4 py-3">
                <div className="font-zin text-base font-bold tracking-widest text-text-main md:text-lg">
                Effective monthly
              </div>
            </TableCell>
            <TableCell className="border-t-2 border-border px-2.5 py-3 text-center">
                <span className="font-zin text-base font-bold tracking-widest text-text-main md:text-lg">
                {formatCurrency(flentRent)}
              </span>
              <span className="text-xs font-medium text-text-main/80">/mo</span>
            </TableCell>
            <TableCell className="border-t-2 border-border px-2.5 py-3 text-center">
                <span className="font-zin text-base font-bold tracking-widest text-text-main md:text-lg">
                {formatCurrency(tradMonthly)}
              </span>
              <span className="text-xs font-medium text-text-main/80">/mo</span>
            </TableCell>
          </TableRow>

          <SectionPaddingRow withTopBorder />

          <SectionHeader title="One-Time & Hidden Costs" />

          <SectionPaddingRow />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Security Deposit"
            flent={
              <div>
                <span className="font-bold text-text-main">{formatCurrency(flentDeposit)}</span>
                <div className="text-xs text-muted-foreground">3 months&apos; rent</div>
              </div>
            }
            trad={
              <div>
                <EditCell
                  value={effDeposit}
                  onChange={setTradDeposit}
                  variant="mobileFlat"
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_deposit", newValue, previousValue)
                  }
                />
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {DEPOSIT_MONTHS_TRAD} months typical
                </div>
              </div>
            }
          />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Brokerage"
            divider
            flent={<span className="text-base font-bold text-forest-green">Zero, always!</span>}
            trad={
              <div>
                <EditCell
                  value={effBrokerage}
                  onChange={setTradBrokerage}
                  variant="mobileFlat"
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_brokerage", newValue, previousValue)
                  }
                />
                <div className="mt-0.5 text-xs text-muted-foreground">1 month rent typical</div>
              </div>
            }
          />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Essentials"
            divider
            sub="Kitchenware, curtains, bedding"
            flent={<span className="text-base font-bold text-forest-green">Included</span>}
            trad={
              <div>
                <span className="text-base font-bold text-text-main">
                  {formatCurrency(ESSENTIALS)}
                </span>
                <div className="text-xs text-muted-foreground">Can&apos;t rent these</div>
              </div>
            }
          />

          {furnitureMode === "buy" ? (
            <ComparisonRow
              rowClassName="border-b-0"
              label="Furniture Depreciation"
              divider
              sub="Value lost over 11 months"
              flent={
                <span className="text-base font-bold text-forest-green">
                  No furniture to lose
                </span>
              }
              trad={
                <div className="mx-auto max-w-40 text-left">
                  <div className="mb-0.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">Purchased</span>
                    <span className="font-bold text-text-main">{formatCurrency(FURN_BUY)}</span>
                  </div>
                  <div className="mb-0.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">Resale (11mo)</span>
                    <span className="font-bold text-text-main">
                      {formatCurrency(FURN_BUY - tradFurnBuyCost)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 text-xs">
                    <span className="font-bold text-brick-red">Value lost</span>
                    <span className="font-extrabold text-brick-red">{formatCurrency(tradFurnBuyCost)}</span>
                  </div>
                  <div className="mt-1 text-xs font-bold text-brick-red md:text-sm">
                    = {formatCurrency(tradFurnBuyMo)}/mo effective cost
                  </div>
                </div>
              }
            />
          ) : null}

          <ComparisonRow
            rowClassName="border-b-0"
            label="Exit / Painting"
            divider
            flent={
              <div>
                <span className="font-bold text-text-main">{formatCurrency(FLENT_EXIT_FEE)}</span>
                <div className="text-xs text-muted-foreground">Fixed exit fee</div>
              </div>
            }
            trad={
              <div>
                <EditCell
                  value={tradPainting}
                  onChange={setTradPainting}
                  variant="mobileFlat"
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_painting", newValue, previousValue)
                  }
                />
                <div className="mt-0.5 text-xs text-muted-foreground">+ surprise deductions</div>
              </div>
            }
          />

          {mode === "roommate" ? (
            <ComparisonRow
              rowClassName="border-b-0"
              label="Flatmate Vacancy"
              divider
              sub="~10 days to find flatmates"
              flent={
                <span className="text-base font-bold text-forest-green">
                  We match flatmates
                </span>
              }
              trad={
                <div>
                  <span className="text-base font-bold text-brick-red">
                    {formatCurrency(tradVacancy)}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(VACANCY_DAILY)}/day × ~{VACANCY_DAYS} days
                  </div>
                </div>
              }
            />
          ) : null}

          <ComparisonRow
            rowClassName="border-b-0"
            label="Deposit Opportunity Cost"
            divider
            sub="Returns lost @ 12% p.a."
            flent={
              <span className="text-base font-bold text-text-main">
                {formatCurrency(flentDepositOpp)}
              </span>
            }
            trad={
              <span className="text-base font-bold text-text-main">
                {formatCurrency(tradDepositOpp)}
              </span>
            }
          />

          <SectionPaddingRow />

          <TableRow className="border-b-0 bg-forest-green">
            <TableCell className="border-t-2 border-border px-4 py-4">
                <div className="font-zin text-xl tracking-widest text-text-invert md:text-2xl">
                Grand Total
              </div>
              <div className="text-xs font-medium text-text-invert/80">{DURATION} months</div>
            </TableCell>
            <TableCell className="border-t-2 border-border px-4 py-4 text-center">
                <span className="font-zin text-xl tracking-widest text-text-invert md:text-2xl">
                {formatCurrency(flentTotal)}
              </span>
            </TableCell>
            <TableCell className="border-t-2 border-border px-4 py-4 text-center">
                <span className="font-zin text-xl tracking-widest text-text-invert md:text-2xl">
                {formatCurrency(tradTotal)}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </section>

    </section>
  );
}
