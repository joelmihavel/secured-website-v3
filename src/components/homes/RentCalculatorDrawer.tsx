import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/Button";
import {
  IconChevronLeft as ChevronLeft,
  IconPhone as PhoneIcon,
} from "@tabler/icons-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import {
  RentBreakdown,
  ADD_ONS,
  formatCurrency,
  getRoomRentBreakdown,
  getPropertyRentBreakdown,
  LockInPeriod,
  propertyHasDiscount,
  getRibbonDiscountSavings,
  getDiscountEndDateFormatted,
} from "@/lib/property-utils";
import { Property, Room } from "@/lib/webflow";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCTATracking } from "@/hooks/useCTATracking";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPropertyInterestMessage } from "@/constants";
import { useMobile } from "@/hooks/useMobile";
import { useWhatsAppCta } from "@/hooks/useWhatsAppCta";
import { CTA_IDS } from "@/lib/cta-ids";
import { Badge } from "@/components/ui/badge";
import Lottie from "lottie-react";
import { useLottieData } from "@/hooks/useLottieData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  trackHomesRentCalculatorOpened,
  trackHomesRentLockInChanged,
  PropertyTypeFilter,
  trackHomeTourClicked,
} from "@/lib/posthog-tracking";

function calculatePromoSavings(
  totalRent: number | null,
  discountPercent: number,
  hasDiscount: boolean
) {
  if (!hasDiscount) return 0;
  if (discountPercent <= 0) return 0;
  if (!totalRent) return 0;
  return Math.round(totalRent * (discountPercent / 100));
}

function buildRentCalculatorContext({
  slug,
  propertyName,
  propertyType,
  propertyArea,
  room,
}: {
  slug: string;
  propertyName: string;
  propertyType: PropertyTypeFilter;
  propertyArea?: string;
  room?: Room;
}) {
  return {
    property_slug: slug,
    property_name: propertyName,
    property_type: propertyType,
    property_area: propertyArea,
    source: room ? ("room" as const) : ("full_house" as const),
    room_id: room?.id,
    room_name: room?.fieldData?.name,
  };
}

function useRentPricing({
  initialLockIn,
  initialBreakdown,
  room,
  property,
}: {
  initialLockIn: LockInPeriod;
  initialBreakdown: RentBreakdown;
  room?: Room;
  property?: Property;
}) {
  const [selectedLockIn, setSelectedLockIn] =
    useState<LockInPeriod>(initialLockIn);
  const [breakdown, setBreakdown] = useState<RentBreakdown>(initialBreakdown);

  // Update local state when props change
  useEffect(() => {
    setSelectedLockIn(initialLockIn);
    setBreakdown(initialBreakdown);
  }, [initialLockIn, initialBreakdown]);

  const hasDiscount = property ? propertyHasDiscount(property) : false;
  const propertyType: PropertyTypeFilter = hasDiscount
    ? "discounted"
    : "standard";
  const discountPercent =
    property && hasDiscount ? Number(property.fieldData["discount"] || 0) : 0;

  const promoSavings = calculatePromoSavings(
    breakdown.totalRent,
    discountPercent,
    hasDiscount
  );
  const discountEndDate =
    property && hasDiscount ? getDiscountEndDateFormatted(property) : null;

  const effectiveTotalRent =
    breakdown.totalRent !== null && promoSavings > 0
      ? breakdown.totalRent - promoSavings
      : breakdown.totalRent;

  const handleLockInChange = (lockIn: LockInPeriod) => {
    setSelectedLockIn(lockIn);

    let nextBreakdown: RentBreakdown | null = null;
    if (room) {
      nextBreakdown = getRoomRentBreakdown(room, lockIn);
    } else if (property) {
      nextBreakdown = getPropertyRentBreakdown(property, lockIn);
    }

    if (!nextBreakdown) {
      return null;
    }

    setBreakdown(nextBreakdown);

    const nextPromoSavings = calculatePromoSavings(
      nextBreakdown.totalRent,
      discountPercent,
      hasDiscount
    );
    const nextEffectiveTotal =
      nextBreakdown.totalRent !== null && nextPromoSavings > 0
        ? nextBreakdown.totalRent - nextPromoSavings
        : nextBreakdown.totalRent;

    return { nextBreakdown, nextPromoSavings, nextEffectiveTotal };
  };

  return {
    selectedLockIn,
    breakdown,
    hasDiscount,
    propertyType,
    discountPercent,
    promoSavings,
    discountEndDate,
    effectiveTotalRent,
    handleLockInChange,
  };
}

interface RentCalculatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  lockInPeriod: LockInPeriod;
  breakdown: RentBreakdown;
  room?: Room;
  property?: Property;
  slug: string;
  propertyName: string;
  /** Human-readable area / neighbourhood name (Location.fieldData.name). */
  propertyArea?: string;
}

export const RentCalculatorDrawer = ({
  isOpen,
  onClose,
  title,
  image,
  lockInPeriod: initialLockIn,
  breakdown: initialBreakdown,
  room,
  property,
  slug,
  propertyName,
  propertyArea,
}: RentCalculatorDrawerProps) => {
  const isMobile = useMobile();
  const { trackCTAClick } = useCTATracking();
  const whatsAppCta = useWhatsAppCta(
    getPropertyInterestMessage(propertyName),
    {
      format: "wa.me",
      tracking: {
        source: "rent_calculator",
        propertySlug: slug,
        propertyName,
        propertyArea,
        ctaId: CTA_IDS.RENT_CALCULATOR_TALK_TO_US,
      },
    }
  );
  const lockInLottie = useLottieData(
    "/lotties/lock-in-duration-lottie.json"
  );
  const {
    selectedLockIn,
    breakdown,
    hasDiscount,
    propertyType,
    discountPercent,
    promoSavings,
    discountEndDate,
    effectiveTotalRent,
    handleLockInChange,
  } = useRentPricing({
    initialLockIn,
    initialBreakdown,
    room,
    property,
  });

  // Fire an open event once when the drawer becomes visible with initial state
  useEffect(() => {
    if (!property) return;
    if (!isOpen) return;

    trackHomesRentCalculatorOpened({
      ...buildRentCalculatorContext({
        slug,
        propertyName,
        propertyType,
        propertyArea,
        room,
      }),
      initial_lock_in_months: initialLockIn,
      rent_total_after_discounts: effectiveTotalRent,
      open_cta_id: room
        ? CTA_IDS.ROOM_UNDERSTAND_RENT
        : CTA_IDS.FULL_HOUSE_SEE_PRICING,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Track lock-in changes with full pricing context
  const handleLockInChangeWithTracking = (lockIn: LockInPeriod) => {
    const result = handleLockInChange(lockIn);
    if (!result) return;
    if (!property) return;

    trackHomesRentLockInChanged({
      ...buildRentCalculatorContext({
        slug,
        propertyName,
        propertyType,
        propertyArea,
        room,
      }),
      lock_in_months: lockIn,
      rent_base: result.nextBreakdown.baseRent,
      rent_maintenance: result.nextBreakdown.maintenance,
      rent_furnishing: result.nextBreakdown.furnishing,
      rent_convenience: result.nextBreakdown.convenience,
      rent_gst: result.nextBreakdown.gst,
      rent_lock_in_discount: result.nextBreakdown.lockInDiscount ?? 0,
      rent_promo_discount: result.nextPromoSavings,
      rent_total_after_discounts: result.nextEffectiveTotal,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[90vh] md:h-[95vh] rounded-t-[20px] outline-none">
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-6xl">
            {/* Header */}
            <div
              className="flex items-center gap-1.5 md:gap-2 mb-6 md:mb-8 cursor-pointer w-fit"
              onClick={() => {
                trackCTAClick({
                  cta_id: CTA_IDS.RENT_CALCULATOR_BACK,
                  cta_text: "Back to Apartment",
                  cta_type: "button",
                  page_section: "rent_calculator_drawer",
                });
                onClose();
              }}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">
                <span className="hidden sm:inline">Back to Apartment</span>
                <span className="sm:hidden">Back</span>
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-24">
              {/* Left Column */}
              <div className="lg:w-1/2 space-y-6 md:space-y-8">
                {/* Room Info */}
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-fluid-h3 font-heading text-text-main mb-1 md:mb-2">
                      {title}
                    </h2>
                    <p className="text-xs md:text-sm text-text-main/60">
                      In {propertyName}
                    </p>
                  </div>
                </div>

                {/* Lock-In Period Card */}
                <Card className="bg-text-invert text-text-main border-border rounded-lg shadow-shadow gap-2 py-0">
                  <CardContent className="p-4">
                    {/* Lottie + Text: 2-column on desktop, stacked on mobile */}
                    <div className="flex flex-col lg:grid lg:grid-cols-[56px_minmax(0,1fr)] lg:items-center gap-3">
                      {/* Lottie - mobile above, desktop in left column */}
                      {lockInLottie && (
                        <>
                          {/* Mobile: 56x56 above text, aligned left */}
                          <div className="flex lg:hidden items-center justify-start">
                            <Lottie
                              animationData={lockInLottie}
                              loop
                              style={{ width: 56, height: 56 }}
                            />
                          </div>
                          {/* Desktop: 64x64 in left column */}
                          <div className="hidden lg:flex items-center justify-center">
                            <Lottie
                              animationData={lockInLottie}
                              loop
                              style={{ width: 64, height: 64 }}
                            />
                          </div>
                        </>
                      )}
                      <div className="flex flex-col gap-1 lg:gap-1.5">
                        <CardTitle className="text-base md:text-lg font-medium text-text-main">
                          Select your Lock-In Period
                        </CardTitle>
                        <CardDescription className="text-text-main/80">
                          The total duration of your rental agreement. A longer lock-in results in a lower monthly rent.
                        </CardDescription>
                      </div>
                    </div>

                    {/* Tabs: full-width row under the two-column layout on desktop */}
                    <div className="mt-2">
                      <Tabs
                        value={String(selectedLockIn)}
                        onValueChange={(v) =>
                          handleLockInChangeWithTracking(Number(v) as LockInPeriod)
                        }
                        variant="lockIn"
                      >
                        <TabsList>
                          <TabsTrigger value="6">6 months</TabsTrigger>
                          <TabsTrigger value="9">9 months</TabsTrigger>
                          <TabsTrigger value="11">11 months</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                {/* Rent Breakdown */}
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-bg-white">
                        <TableHead className="text-base md:text-lg font-medium text-text-main">
                          Rent Breakdown
                        </TableHead>
                        <TableHead className="text-base md:text-lg font-medium text-text-main text-right">
                          ₹
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-xs md:text-sm text-text-main/80">Base Rent</TableCell>
                        <TableCell className="text-xs md:text-sm text-text-main/80 text-right">{formatCurrency(breakdown.baseRent)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs md:text-sm text-text-main/80">Building Maintenance</TableCell>
                        <TableCell className="text-xs md:text-sm text-text-main/80 text-right">{formatCurrency(breakdown.maintenance)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs md:text-sm text-text-main/80">Furnishing</TableCell>
                        <TableCell className="text-xs md:text-sm text-text-main/80 text-right">{formatCurrency(breakdown.furnishing)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs md:text-sm text-text-main/80">Convenience</TableCell>
                        <TableCell className="text-xs md:text-sm text-text-main/80 text-right">{formatCurrency(breakdown.convenience)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs md:text-sm text-text-main/80">
                          GST
                        </TableCell>
                        <TableCell className="text-xs md:text-sm text-text-main/80 text-right">
                          {formatCurrency(breakdown.gst)}
                        </TableCell>
                      </TableRow>

                      {/* Promo discount – only when discount is configured in CMS.
                          This reduces the payable amount via effectiveTotalRent. */}
                      {hasDiscount && promoSavings > 0 && (
                        <TableRow>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="discount" className="w-fit">
                                {discountPercent}% Promo Discount
                              </Badge>
                              {discountEndDate && (
                                <span className="text-[10px] md:text-xs text-text-main/60 font-normal">
                                  If booked before {discountEndDate}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="discount" className="w-fit">
                              - {formatCurrency(promoSavings)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Lock-in discount – only when computed value is positive */}
                      {(breakdown.lockInDiscount || 0) > 0 && (
                        <TableRow>
                          <TableCell>
                            <Badge variant="discount" className="w-fit">
                              Lock-in Discount
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="discount" className="w-fit">
                              - {formatCurrency(breakdown.lockInDiscount)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow className="bg-bg-white">
                        <TableCell className="text-sm md:text-base font-bold text-text-main">
                          Total Rent
                        </TableCell>
                        <TableCell className="text-sm md:text-base font-bold text-text-main text-right">
                          {formatCurrency(effectiveTotalRent)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* One-Time Charges */}
                <div>
                  <h3 className="text-base md:text-lg font-medium text-text-main mb-3 md:mb-4">
                    One-Time Charges
                  </h3>
                  <div className="flex justify-between text-xs md:text-sm text-text-main/80">
                    <span>Society Move-In Fee</span>
                    <span className="text-text-main/50">
                      as per society norms
                    </span>
                  </div>
                </div>

                {/* Actions – stacked buttons; fixed white bar on mobile, inline on desktop */}
                <div
                  className={cn(
                    "pt-3 md:pt-4",
                    "bg-bg-white md:bg-transparent",
                    "fixed inset-x-0 bottom-0 px-4 pb-4 md:static md:px-0 md:pb-0"
                  )}
                >
                  <div className="max-w-6xl mx-auto md:max-w-none space-y-2 md:space-y-3">
                    <Button
                      size="md"
                      className="w-full"
                      href={`${process.env.NEXT_PUBLIC_CAL_URL}?property-name=${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta-id={CTA_IDS.RENT_CALCULATOR_BOOK_TOUR}
                      data-cta-context="rent_calculator_drawer"
                      onClick={() => {
                        if (!property) return;
                        trackHomeTourClicked({
                          source: "rent_calculator",
                          property_slug: slug,
                          property_name: propertyName,
                          property_area: propertyArea,
                          property_type: propertyType,
                          room_id: room?.id,
                          room_name: room?.fieldData?.name,
                          lock_in_months: selectedLockIn,
                          rent_total_after_discounts: effectiveTotalRent,
                          cta_id: CTA_IDS.RENT_CALCULATOR_BOOK_TOUR,
                        });
                      }}
                    >
                      Book a Tour
                    </Button>
                    <Button
                      size="md"
                      variant="ghost"
                      className="w-full bg-bg-white"
                      {...whatsAppCta}
                      leftIcon={isMobile ? <WhatsAppIcon /> : <PhoneIcon />}
                      data-cta-id={CTA_IDS.RENT_CALCULATOR_TALK_TO_US}
                      data-cta-context="rent_calculator_drawer"
                    >
                      {isMobile ? "Talk to us" : "Get a Call Back"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:w-1/2 space-y-6 md:space-y-10">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <Card className="bg-text-invert text-text-main border-border rounded-lg shadow-shadow p-4 md:p-6 text-center">
                    <CardContent className="p-0">
                      <p className="text-xs md:text-sm font-medium text-text-main mb-3 md:mb-4">
                        Monthly Rent
                      </p>
                      <div className="text-fluid-h3 font-heading text-text-main mb-1.5 md:mb-2">
                        {formatCurrency(effectiveTotalRent)}{" "}
                        <span className="text-sm md:text-base font-body text-text-main/70">
                          / mo
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs text-text-main/60">
                        GST Included
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-text-invert text-text-main border-border rounded-lg shadow-shadow p-4 md:p-6 text-center">
                    <CardContent className="p-0">
                      <p className="text-xs md:text-sm font-medium text-text-main mb-3 md:mb-4">
                        Deposit Charges
                      </p>
                      <div className="text-fluid-h3 font-heading text-text-main mb-1.5 md:mb-2">
                        {formatCurrency(breakdown.deposit)}
                      </div>
                      <p className="text-[10px] md:text-xs text-text-main/60">
                        (Refundable)
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Add-Ons */}
                <div>
                  <h3 className="text-base md:text-lg font-medium text-text-main mb-1.5 md:mb-2">
                    Add-Ons
                  </h3>
                  <p className="text-xs md:text-sm text-text-main/60 mb-4 md:mb-6">
                    Prices listed are approximate per room. Flent doesn&apos;t
                    manage these services.
                  </p>

                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {ADD_ONS.map((addon, index) => (
                      <div
                        key={index}
                        className={cn(
                          "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium",
                          // Alternating colors based on screenshot approximation or random assignment
                          // Screenshot shows: Maid (gray), Electricity (pink), Water (gray), Wifi (green), Cook (pink), Car Parking (gray), Key (green), Move-In (purple), BGV (gray)
                          // I'll just use a simple cycle or specific mapping if I want to match exactly.
                          // Let's use a simple cycle for variety.
                          index % 4 === 0
                            ? "bg-gray-100 text-gray-700"
                            : index % 4 === 1
                              ? "bg-pastel-red/30 text-text-main"
                              : index % 4 === 2
                                ? "bg-pastel-green/30 text-text-main"
                                : "bg-pastel-violet/30 text-text-main"
                        )}
                      >
                        {addon.name}{" "}
                        <span className="opacity-60">
                          + {formatCurrency(addon.price)}
                          {addon.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
