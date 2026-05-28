"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRentCalculator } from "./hooks/useRentCalculator";
import { BeyondNumbersSection } from "./sections/BeyondNumbersSection";
import { ComparisonTableSection } from "./sections/ComparisonTableSection";
import { HeroSection } from "./sections/HeroSection";
import { HomeInventorySection } from "./sections/HomeInventorySection";
import { LocalityHomesSection } from "./sections/LocalityHomesSection";
import { SavingsSection } from "./sections/SavingsSection";
import { UpfrontSection } from "./sections/UpfrontSection";
import { AreaDropdown } from "./components/primitives/AreaDropdown";
import type { ComparisonMode } from "./types";
import type { Location, Occupant, Property, Room } from "@/lib/webflow";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { Share2 } from "lucide-react";
import { Info, type InfoStat } from "@/app/(Homepage)/sections/Info";
import {
  parseCalculatorStateFromSearchParams,
  toCanonicalCalculatorSearchParams,
  type RentCalculatorUrlState,
} from "./utils/urlState";
import {
  trackRentCalculatorAreaSelected,
  trackRentCalculatorFurnitureModeChanged,
  trackRentCalculatorInputEdited,
  trackRentCalculatorModeChanged,
  trackRentCalculatorStateUpdated,
  trackRentCalculatorViewed,
  type RentCalculatorInputName,
} from "@/lib/posthog-tracking";

type RentCalculatorClientProps = {
  properties: Property[];
  locations: Location[];
  rooms: Room[];
  occupants: Occupant[];
};

const formatInrValue = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
const parseRentValue = (value: number | string | undefined): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function RentCalculatorClient({
  properties,
  locations,
  rooms,
  occupants,
}: RentCalculatorClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [didCopyShareUrl, setDidCopyShareUrl] = useState(false);

  const initialState = useMemo(
    () => parseCalculatorStateFromSearchParams(searchParams),
    [searchParams]
  );
  const calc = useRentCalculator(initialState);

  const calculatorUrlState = useMemo<RentCalculatorUrlState>(
    () => ({
      mode: calc.mode,
      area: calc.area,
      furnitureMode: calc.furnitureMode,
      flentRent: calc.flentRent,
      tradRent: calc.effTradRent,
      tradMaint: calc.effMaint,
      tradDeposit: calc.effDeposit,
      tradBrokerage: calc.effBrokerage,
      tradPainting: calc.tradPainting,
    }),
    [
      calc.area,
      calc.effBrokerage,
      calc.effDeposit,
      calc.effMaint,
      calc.effTradRent,
      calc.flentRent,
      calc.furnitureMode,
      calc.mode,
      calc.tradPainting,
    ]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const canonicalParams = toCanonicalCalculatorSearchParams(calculatorUrlState, searchParams);
      const canonicalQueryString = canonicalParams.toString();
      const currentQueryString = searchParams.toString();
      if (canonicalQueryString === currentQueryString) return;

      const nextUrl = canonicalQueryString ? `${pathname}?${canonicalQueryString}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [calculatorUrlState, pathname, router, searchParams]);

  const handleShareCalculation = useCallback(async () => {
    const canonicalParams = toCanonicalCalculatorSearchParams(calculatorUrlState, searchParams);
    const canonicalQueryString = canonicalParams.toString();
    const shareUrl = canonicalQueryString
      ? `${window.location.origin}${pathname}?${canonicalQueryString}`
      : `${window.location.origin}${pathname}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setDidCopyShareUrl(true);
      window.setTimeout(() => setDidCopyShareUrl(false), 2000);
    } catch (error) {
      console.error("Failed to copy calculator share URL", error);
      setDidCopyShareUrl(false);
    }
  }, [calculatorUrlState, pathname, searchParams]);
  useEffect(() => {
    trackRentCalculatorViewed({
      surface: "rent_calculator_page",
      default_mode: calc.mode,
      default_area: calc.area,
      default_furniture_mode: calc.furnitureMode,
    });
    // Fire once per mount as page viewed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      trackRentCalculatorStateUpdated({
        mode: calc.mode,
        area: calc.area,
        furniture_mode: calc.furnitureMode,
        flent_rent: calc.flentRent,
        effective_traditional_rent: calc.effTradRent,
        effective_traditional_maintenance: calc.effMaint,
        effective_traditional_deposit: calc.effDeposit,
        effective_traditional_brokerage: calc.effBrokerage,
        traditional_painting: calc.tradPainting,
        flent_total: calc.calculations.flentTotal,
        traditional_total: calc.calculations.tradTotal,
        savings: calc.calculations.savings,
        flent_wins: calc.calculations.flentWins,
      });
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [
    calc.mode,
    calc.area,
    calc.furnitureMode,
    calc.flentRent,
    calc.effTradRent,
    calc.effMaint,
    calc.effDeposit,
    calc.effBrokerage,
    calc.tradPainting,
    calc.calculations.flentTotal,
    calc.calculations.tradTotal,
    calc.calculations.savings,
    calc.calculations.flentWins,
  ]);

  const handleModeChange = (nextMode: ComparisonMode) => {
    if (nextMode === calc.mode) return;
    trackRentCalculatorModeChanged({
      mode_selected: nextMode,
      previous_mode: calc.mode,
    });
    calc.setMode(nextMode);
  };

  const handleAreaChange = (nextArea: string) => {
    if (nextArea === calc.area) return;
    trackRentCalculatorAreaSelected({
      area_selected: nextArea,
      previous_area: calc.area,
      mode: calc.mode,
      interaction_source: "area_chip",
    });
    calc.setArea(nextArea);
  };

  const handleFurnitureModeChange = (nextFurnitureMode: "rent" | "buy") => {
    if (nextFurnitureMode === calc.furnitureMode) return;
    trackRentCalculatorFurnitureModeChanged({
      furniture_mode_selected: nextFurnitureMode,
      previous_furniture_mode: calc.furnitureMode,
      mode: calc.mode,
      area: calc.area,
    });
    calc.setFurnitureMode(nextFurnitureMode);
  };

  const handleInputCommit = (
    inputName: RentCalculatorInputName,
    newValue: number,
    previousValue: number
  ) => {
    trackRentCalculatorInputEdited({
      input_name: inputName,
      new_value: newValue,
      previous_value: previousValue,
      mode: calc.mode,
      area: calc.area,
      furniture_mode: calc.furnitureMode,
      edit_method: "typed",
    });
  };

  const withTexts =
    calc.mode === "roommate"
      ? [
          "Move in tomorrow",
          "Zero brokerage, always",
          "No landlord interaction",
          "3 months deposit",
          "Maintenance handled by Flent",
          "Designer home, ready to live",
          "₹10,000 exit fee - that's it",
          "Wi-Fi & water purifier included",
          "Flatmate matching by Flent",
        ]
      : [
          "Move in tomorrow",
          "Zero brokerage, always",
          "No landlord interaction",
          "3 months deposit",
          "Maintenance handled by Flent",
          "Designer home, ready to live",
          "₹10,000 exit fee - that's it",
          "Wi-Fi & water purifier included",
        ];

  const withoutTexts =
    calc.mode === "roommate"
      ? [
          "2-4 weeks of house hunting",
          "1 month rent to a broker",
          "Monthly landlord visits & opinions",
          "6-10 months deposit locked up",
          "You call the plumber yourself",
          "Empty flat, start from zero",
          "₹30k+ painting & surprise deductions",
          "Arrange and install yourself",
          "Weeks of interviews & guessing",
        ]
      : [
          "2-4 weeks of house hunting",
          "1 month rent to a broker",
          "Monthly landlord visits & opinions",
          "6-10 months deposit locked up",
          "You call the plumber yourself",
          "Empty flat, start from zero",
          "₹30k+ painting & surprise deductions",
          "Arrange and install yourself",
        ];

  const upfrontSavings = calc.calculations.tradUpfront - calc.calculations.flentUpfront;
  const savings = calc.calculations.savings;
  const selectedLocation = useMemo(
    () =>
      locations.find(
        (location) => location.fieldData.name.trim().toLowerCase() === calc.area.trim().toLowerCase()
      ),
    [calc.area, locations]
  );
  const modeSpecificAreaRentFloor = useMemo(() => {
    if (!selectedLocation) return null;

    const areaPropertyIds = new Set(
      properties
        .filter((property) => property.fieldData.location === selectedLocation.id)
        .map((property) => property.id)
    );
    if (areaPropertyIds.size === 0) return null;

    if (calc.mode === "roommate") {
      const sharedRents = rooms
        .filter((room) => {
          const propertyId = room.fieldData.property;
          return Boolean(propertyId && areaPropertyIds.has(propertyId));
        })
        .map((room) => parseRentValue(room.fieldData["room-rent"]))
        .filter((rent) => rent > 0);
      return sharedRents.length > 0 ? Math.min(...sharedRents) : null;
    }

    const soloRents = properties
      .filter((property) => areaPropertyIds.has(property.id))
      .map((property) => parseRentValue(property.fieldData["rent-in-rupees"]))
      .filter((rent) => rent > 0);
    return soloRents.length > 0 ? Math.min(...soloRents) : null;
  }, [calc.mode, properties, rooms, selectedLocation]);
  const isFlentRentBelowAreaMin =
    modeSpecificAreaRentFloor !== null && calc.flentRent < modeSpecificAreaRentFloor;

  const rentInfoStats: InfoStat[] = useMemo(() => {
    const isUpfrontNegative = upfrontSavings < 0;
    const isSavingsNegative = savings < 0;

    return [
      {
        value: isUpfrontNegative ? "0" : formatInrValue(upfrontSavings),
        label: isUpfrontNegative
          ? "Oops. This falls outside of a Flent-standard home."
          : "Saved on day 1 of moving into a flent home",
        color: "text-text-invert",
        bgColor: "bg-forest-green",
        rotation: -3,
      },
      {
        value: formatInrValue(Math.abs(savings)),
        label: isSavingsNegative
          ? "Premium over 11 months due to additional costs"
          : "Saved over 11 months due to additional costs",
        color: "text-text-invert",
        bgColor: "bg-ground-brown",
        rotation: 2,
      },
      {
        value: "0",
        label: "Brokerage calls, landlord visits, flatmate interviews & painting disputes",
        color: "text-text-invert",
        bgColor: "bg-brick-red",
        rotation: -2,
      },
    ];
  }, [savings, upfrontSavings]);

  const infoHeading: ReactNode = (
    <>
      All these perks,
      <br />
      while living in a
      <br />
      <span className="text-forest-green">designer home</span>
    </>
  );

  const infoTopContent = (
    <div className="mx-auto max-w-5xl text-center">
      <HeroSection />
      <section className="mb-2 flex justify-center">
        <Tabs
          value={calc.mode}
          onValueChange={(value) => handleModeChange(value as ComparisonMode)}
          variant="pill"
          className="w-full max-w-md"
        >
          <TabsList className="flex w-full">
            <TabsTrigger value="roommate" className="w-1/2 flex-1 md:w-1/2">
              Shared Living
            </TabsTrigger>
            <TabsTrigger value="1bhk" className="w-1/2 flex-1 md:w-1/2">
              Solo Living
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>
      <AreaDropdown area={calc.area} setArea={handleAreaChange} />
    </div>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-pastel-brown/20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/patterns/jupiter.svg')",
          backgroundRepeat: "repeat",
          opacity: 0.02,
          maskImage: "linear-gradient(to bottom, transparent 40%, black 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 40%, black 60%)",
        }}
      />
      <div className="relative z-10 w-full pb-10">
        <Info
          topContent={infoTopContent}
          topClassName="bg-pastel-violet"
          showTopTear={false}
          heading={infoHeading}
          hideHeadingOnMobile
          stats={rentInfoStats}
          numberClassName="text-fluid-h1"
          contentContainerClassName="mx-auto w-full max-w-screen-2xl px-4 py-12 md:px-8 lg:px-20"
        />

        <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8 lg:px-20">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="mb-4 hidden text-left text-subtitle-sm text-text-main/60 md:block">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-ground-brown">
                Our methodology
              </p>
              <p>
                Traditional renting assumptions are benchmarked to average rates in {calc.area}.
                Deposit opportunity cost is calculated at your selected rate, defaulting to 12% p.a.
                based on long-term Nifty 50 returns. Furniture value assumes 50% depreciation over
                12 months. All assumptions are editable to match your actual costs.
              </p>
            </div>
            <ComparisonTableSection
              area={calc.area}
              mode={calc.mode}
              furnitureMode={calc.furnitureMode}
              setFurnitureMode={handleFurnitureModeChange}
              flentRent={calc.flentRent}
              setFlentRent={calc.setFlentRent}
              minFlentRentInArea={modeSpecificAreaRentFloor}
              isFlentRentBelowAreaMin={isFlentRentBelowAreaMin}
              effTradRent={calc.effTradRent}
              setTradRent={calc.setTradRent}
              effMaint={calc.effMaint}
              setTradMaint={calc.setTradMaint}
              effDeposit={calc.effDeposit}
              setTradDeposit={calc.setTradDeposit}
              effBrokerage={calc.effBrokerage}
              setTradBrokerage={calc.setTradBrokerage}
              tradPainting={calc.tradPainting}
              setTradPainting={calc.setTradPainting}
              isRentLow={calc.calculations.isRentLow}
              flentDeposit={calc.calculations.flentDeposit}
              tradFurnBuyCost={calc.calculations.tradFurnBuyCost}
              tradFurnBuyMo={calc.calculations.tradFurnBuyMo}
              tradVacancy={calc.calculations.tradVacancy}
              flentDepositOpp={calc.calculations.flentDepositOpp}
              tradDepositOpp={calc.calculations.tradDepositOpp}
              tradMonthly={calc.calculations.tradMonthly}
              flentTotal={calc.calculations.flentTotal}
              tradTotal={calc.calculations.tradTotal}
              onInputCommit={handleInputCommit}
            />
            <div className="mb-4 text-left text-subtitle-sm text-text-main/60 md:hidden">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-ground-brown">
                Our methodology
              </p>
              <p>
                Traditional renting assumptions are benchmarked to average rates in {calc.area}.
                Deposit opportunity cost is calculated at your selected rate, defaulting to 12% p.a.
                based on long-term Nifty 50 returns. Furniture value assumes 50% depreciation over
                12 months. All assumptions are editable to match your actual costs.
              </p>
            </div>
            <div className="rounded-xl bg-ground-brown/10 px-4 py-6 md:px-6 md:py-8">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <UpfrontSection
                  flentUpfront={calc.calculations.flentUpfront}
                  tradUpfront={calc.calculations.tradUpfront}
                />

                <SavingsSection
                  savings={calc.calculations.savings}
                  flentWins={calc.calculations.flentWins}
                  affordItems={calc.calculations.affordItems}
                  mode={calc.mode}
                  area={calc.area}
                />
                <section className="mb-5 flex h-full flex-col justify-center rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 font-heading text-fluid-h4 text-text-main">
                    <Share2 className="size-5" aria-hidden="true" />
                    <span>Share</span>
                  </h3>
                  <p className="mt-2 text-subtitle-sm text-text-main/80">
                    Friend wants to know how is Flent better? Share this with them!
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      type="button"
                      onClick={handleShareCalculation}
                    >
                      {didCopyShareUrl ? "Link Copied!" : "Share Calculation"}
                    </Button>
                  </div>
                </section>
              </div>
            </div>
            <HomeInventorySection />
          </div>

          <div>
            <BeyondNumbersSection mode={calc.mode} withItems={withTexts} withoutItems={withoutTexts} />
          </div>
        </div>

        <LocalityHomesSection
          area={calc.area}
          properties={properties}
          locations={locations}
          rooms={rooms}
          occupants={occupants}
        />
      </div>
      </div>
    </main>
  );
}
