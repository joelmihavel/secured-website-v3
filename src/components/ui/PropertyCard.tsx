"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBed as Bed,
  IconBath as Bath,
  IconSquare as Square,
  IconMapPin as MapPin,
  IconArrowRight as ArrowRight,
  IconArrowUpRight as ArrowUpRight,
  IconCalendar as Calendar,
  IconDoor as DoorOpen,
  IconUsers as Users,
  IconBuilding as Building2,
  IconMap,
} from "@tabler/icons-react";
import { Property, Room, Occupant } from "@/lib/webflow";
import { Button } from "@/components/ui/Button";
import { NotificationModal } from "@/components/ui/NotificationModal";
import { UpcomingPropertyMapModal } from "@/components/ui/UpcomingPropertyMapModal";
import { CTA_IDS } from "@/lib/cta-ids";
import { getAvailabilityDateForProperty } from "@/lib/get-availability-date";
import { useDebugMode } from "@/hooks/useDebugMode";
import { trackClickedGetNotifiied } from "@/lib/posthog-tracking";
import {
  propertyHasDiscount,
  getRibbonDiscountSavings,
  getDiscountEndDateFormatted,
  getLowestRoomRentForLockIn,
} from "@/lib/property-utils";
import { getCompanyLogo } from "@/lib/company-logos";

interface PropertyCardProps {
  property: Property;
  index?: number;
  /** Area name from Locations collection (Property.fieldData.location). */
  locationName?: string;
  variant?: "default" | "coming-soon";
  rooms?: Room[];
  occupants?: Occupant[];
}

// Inline CompanyPill Component
const CompanyPill = ({
  company,
  logoFile,
}: {
  company: string;
  logoFile?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex items-center gap-2 rounded-xl overflow-hidden cursor-default h-[34px] max-w-[12ch]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        width: isHovered ? "auto" : "32px",
        paddingRight: isHovered ? "12px" : "0px",
        paddingLeft: isHovered ? "4px" : "0px",
        paddingTop: isHovered ? "4px" : "0px",
        paddingBottom: isHovered ? "4px" : "0px",
        backgroundColor: isHovered
          ? "rgb(243, 244, 246)"
          : "rgba(243, 244, 246, 0)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* Logo or Icon */}
      <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
        {logoFile ? (
          <Image
            src={`/company-logo/${logoFile}`}
            alt={company}
            fill
            className="object-contain"
            style={{ borderRadius: "100%" }}
          />
        ) : (
          <Building2 size={16} className="text-gray-600" />
        )}
      </div>

      {/* Company Name - Animated */}
      <motion.span
        className="text-xs font-medium text-gray-700 font-body truncate"
        initial={false}
        animate={{
          maxWidth: isHovered ? "200px" : "0px",
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {company}
      </motion.span>
    </motion.div>
  );
};

const RIBBON_PHASE_DURATION_MS = 2000;

const getDayWithOrdinal = (day: number): string => {
  if (day > 3 && day < 21) return `${day}th`;

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

const formatLaunchDate = (rawDate?: string): string | null => {
  if (!rawDate) return null;

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const day = getDayWithOrdinal(parsedDate.getDate());
  const month = parsedDate.toLocaleString("en-IN", { month: "long" });
  return `${day} ${month}`;
};

const PropertyCardDiscountRibbon = ({
  showRibbon,
  ribbonPhase,
  discountPercent,
  ribbonSavings,
  discountEndDate,
}: {
  showRibbon: boolean;
  ribbonPhase: number;
  discountPercent: number;
  ribbonSavings: number;
  discountEndDate: string | null;
}) => {
  if (!showRibbon) return null;
  return (
    <div className="bg-forest-green text-white text-center py-2 text-xs md:text-sm font-heading font-bold min-h-[2.5rem] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {ribbonPhase === 0 && (
          <motion.span
            key="percent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="block"
          >
            Save {discountPercent}% OFF every month
          </motion.span>
        )}
        {ribbonPhase === 1 && (
          <motion.span
            key="amount"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="block"
          >
            Save Up to ₹{ribbonSavings.toLocaleString("en-IN")} OFF every month
          </motion.span>
        )}
        {ribbonPhase === 2 && (
          <motion.span
            key="date"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="block"
          >
            Offer valid up to {discountEndDate ?? "—"}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

const PropertyCardImageCarousel = ({
  isDebugMode,
  property,
  locationName,
  locationColors,
  isOccupied,
  isComingSoon,
  currentImageIndex,
  setCurrentImageIndex,
  setIsHovering,
  imageUrl,
  showRibbon,
  ribbonPhase,
  discountPercent,
  ribbonSavings,
  discountEndDate,
}: {
  isDebugMode: boolean;
  property: Property;
  locationName?: string;
  locationColors: { bg: string; text: string };
  isOccupied: boolean;
  isComingSoon: boolean;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsHovering: (v: boolean) => void;
  imageUrl: string;
  showRibbon: boolean;
  ribbonPhase: number;
  discountPercent: number;
  ribbonSavings: number;
  discountEndDate: string | null;
}) => {
  const showDiscountRibbon = !isComingSoon && !isOccupied && showRibbon;

  return (
    <div
      className={`group/card rounded-t-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative bg-white h-full ${
        isOccupied ? "pointer-events-none" : ""
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Debug Info Badge */}
      {isDebugMode && (
        <div
          className="absolute top-3 md:top-4 left-3 md:left-4 z-10 px-2 py-1 rounded bg-black/80 text-white text-[10px] font-mono cursor-pointer hover:bg-black active:bg-green-700 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const pid = property.fieldData.pid || "";
            navigator.clipboard.writeText(pid);
          }}
          title="Click to copy"
        >
          PID: {property.fieldData.pid || "N/A"}
        </div>
      )}

      {/* Location Tag in Top Right */}
      {locationName && (
        <div
          className={`absolute top-3 md:top-4 right-3 md:right-4 z-10 px-2 md:px-4 py-1 md:py-2 rounded-t-[1rem] border border-text-main ${locationColors.bg} ${locationColors.text} flex items-center gap-1 md:gap-1`}
        >
          <MapPin size={12} className="md:w-[14px] md:h-[14px]" />
          <span className="text-subtitle-sm font-medium font-body">
            {locationName}
          </span>
        </div>
      )}

      {/* Image Section + Discount Ribbon Overlay */}
      <div className="relative h-[300px] md:h-[340px] w-full bg-gray-100 overflow-hidden shrink-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{
              opacity: 0,
              filter: isComingSoon ? "blur(20px)" : "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: isComingSoon ? "blur(20px)" : "blur(0px)",
            }}
            exit={{
              opacity: 0,
              filter: isComingSoon ? "blur(20px)" : "blur(10px)",
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={imageUrl}
              alt={property.fieldData.name}
              fill
              className={`object-cover transition-transform duration-700 ${
                !isComingSoon ? "group-hover/card:scale-110" : ""
              } pointer-events-none`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Discount Ribbon overlays on top of image so non-discounted cards use full image height */}
        {showDiscountRibbon && (
          <div className="absolute inset-x-0 bottom-0 z-10">
            <PropertyCardDiscountRibbon
              showRibbon={showDiscountRibbon}
              ribbonPhase={ribbonPhase}
              discountPercent={discountPercent}
              ribbonSavings={ribbonSavings}
              discountEndDate={discountEndDate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const PropertyCard = ({
  property,
  locationName,
  variant = "default",
  rooms = [],
  occupants = [],
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapJourneySessionId, setMapJourneySessionId] = useState<string | undefined>(
    undefined
  );
  const [ribbonPhase, setRibbonPhase] = useState(0);
  const isDebugMode = useDebugMode();

  // Build array of all available images
  const images = React.useMemo(
    () =>
      [
        property.fieldData["property-thumbnail"]?.url ||
          property.fieldData["property-featured-photo"]?.url,
        ...(property.fieldData["property-photos"]?.map((photo) => photo.url) ||
          []),
      ].filter(Boolean) as string[],
    [property]
  );

  const imageUrl = images[currentImageIndex] || "/images/placeholder.jpg";

  useEffect(() => {
    if (isHovering && images.length > 1 && variant !== "coming-soon") {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isHovering, images.length, variant]);

  const isComingSoon = variant === "coming-soon";
  const isOccupied = !isComingSoon && !property.fieldData.available;

  const hasActiveDiscount = propertyHasDiscount(property) === true;
  const showRibbon = hasActiveDiscount && !isOccupied;
  const ribbonSavings = getRibbonDiscountSavings(property, rooms);
  const discountEndDate = getDiscountEndDateFormatted(property);
  const discountPercent = Number(property.fieldData["discount"]) || 0;
  const launchDate = formatLaunchDate(property.fieldData["available-from"]);
  const launchText = launchDate ? `Launching on ${launchDate}` : "Coming Soon";

  useEffect(() => {
    if (!showRibbon) return;
    const id = setInterval(
      () => setRibbonPhase((p) => (p + 1) % 3),
      RIBBON_PHASE_DURATION_MS
    );
    return () => clearInterval(id);
  }, [showRibbon]);

  // Calculate derived data
  const propertyRoomIds = React.useMemo(
    () => property.fieldData.rooms || [],
    [property]
  );
  const propertyRooms = React.useMemo(
    () => rooms.filter((r) => propertyRoomIds.includes(r.id)),
    [rooms, propertyRoomIds]
  );
  const totalRooms = React.useMemo(() => propertyRoomIds.length, [propertyRoomIds]);
  const availableRooms = React.useMemo(
    () => propertyRooms.filter((r) => r.fieldData.available).length,
    [propertyRooms]
  );
  const allRoomsAvailable = React.useMemo(
    () => totalRooms > 0 && availableRooms === totalRooms,
    [availableRooms, totalRooms]
  );
  const lowestRoomRent = React.useMemo(
    () => getLowestRoomRentForLockIn(propertyRooms, 11),
    [propertyRooms]
  );
  const propertyLevelRent = React.useMemo(() => {
    const rawRent = property.fieldData["rent-in-rupees"];
    if (typeof rawRent === "number") {
      return Number.isFinite(rawRent) ? rawRent : 0;
    }
    if (!rawRent) return 0;
    const parsedRent = Number(rawRent.replace(/,/g, "").trim());
    return Number.isFinite(parsedRent) ? parsedRent : 0;
  }, [property]);
  const displayedRent = lowestRoomRent > 0 ? lowestRoomRent : propertyLevelRent;

  // Get companies
  const companies = React.useMemo(() => {
    const companySet = new Set<string>();
    propertyRooms.forEach((room) => {
      if (room.fieldData.occupant) {
        const occupant = occupants.find(
          (o) => o.id === room.fieldData.occupant
        );
        if (occupant && occupant.fieldData.company) {
          companySet.add(occupant.fieldData.company);
        }
      }
    });
    return Array.from(companySet);
  }, [propertyRooms, occupants]);

  // Use uniform pastel-pink background with black text/icon for all locations
  const locationColors = {
    bg: "bg-pastel-pink",
    text: "text-black",
  };

  return (
    <div
      className={`flex flex-col relative w-full h-full ${
        isOccupied ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-col h-full">
        <PropertyCardImageCarousel
          isDebugMode={isDebugMode}
          property={property}
          locationName={locationName}
          locationColors={locationColors}
          isOccupied={isOccupied}
          isComingSoon={isComingSoon}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          setIsHovering={setIsHovering}
          imageUrl={imageUrl}
          showRibbon={showRibbon}
          ribbonPhase={ribbonPhase}
          discountPercent={discountPercent}
          ribbonSavings={ribbonSavings}
          discountEndDate={discountEndDate}
        />

        {/* Content Section */}
        <div className="p-4 md:p-6 flex flex-col gap-2 md:gap-3 bg-white flex-grow">
          {/* Title */}
          <div className="flex items-center gap-2 pb-2">
            <h3 className="text-fluid-h3 font-zin text-text-main leading-tight line-clamp-1">
              {property.fieldData.name.split(",")[0]}
            </h3>
            <ArrowUpRight className="w-6 h-6 shrink-0 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300 ease-out text-text-main" />
          </div>

          {isComingSoon ? (
            /* Coming Soon Variant Content */
            <>
              {/* Availability Date */}
              <div className="flex items-center gap-2 text-text-main/80">
                <Calendar size={18} className="md:w-5 md:h-5" />
                <span className="font-body text-sm md:text-base">{launchText}</span>
              </div>

              {/* BHK & Area */}
              <div className="flex items-center gap-4 text-text-main/80">
                <div className="flex items-center gap-2">
                  <Bed size={18} className="md:w-5 md:h-5" />
                  <span className="font-body text-sm md:text-base">
                    {property.fieldData["property-bedrooms"]} BHK
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Square size={18} className="rotate-45 md:w-5 md:h-5" />
                  <span className="font-body text-sm md:text-base">
                    {property.fieldData["carpet-area"]} Sq. Ft
                  </span>
                </div>
              </div>

              {/* Private Rooms Price */}
              <div className="flex items-center gap-2 text-text-main/80">
                <span className="font-body text-lg font-medium">₹</span>
                <span className="font-body text-sm md:text-base">
                  Private Rooms: ₹
                  {parseInt(property.fieldData["rent-in-rupees"] || "0")
                    .toLocaleString()
                    .replace(/,/g, "")
                    .slice(0, -3)}
                  K/mo
                </span>
              </div>

              {/* Buttons Wrapper */}
              <div className="mt-auto pt-1 flex flex-col gap-3">
                {/* View on Maps Button */}
                {(() => {
                  const lat = property.fieldData["map-latitude"];
                  const lng = property.fieldData["map-longitude"];
                  const hasCoordinates = lat && lng &&
                    parseFloat(lat) !== 0 && parseFloat(lng) !== 0;

                  if (!hasCoordinates) return null;

                  return (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setMapJourneySessionId(undefined);
                        setIsMapModalOpen(true);
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98, y: 0 }}
                      className="w-full rounded-tr-[1rem] rounded-tl-none rounded-bl-none rounded-br-[1rem] inline-flex items-center justify-center font-bold transition-colors duration-200 cursor-pointer font-heading tracking-wide whitespace-nowrap px-3 py-3 text-button-link gap-2 border border-text-main shadow-[-3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[-1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[-3px] active:translate-y-[3px]"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: "var(--color-text-main)",
                        color: "var(--color-text-main)",
                      }}
                      data-cta-id={CTA_IDS.VIEW_ON_MAPS_COMING_SOON}
                      data-cta-context="coming-soon-section"
                    >
                      <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">
                        <IconMap size={18} />
                      </span>
                      <span className="flex-shrink-0">View on Maps</span>
                    </motion.button>
                  );
                })()}

                {/* Get Launch Invite Button */}
                <Button
                  variant="primary"
                  pastelColor="violet"
                  size="md"
                  className="w-full rounded-tr-[1rem] rounded-tl-none rounded-bl-none rounded-br-[1rem]"
                  data-cta-id={CTA_IDS.PROPERTY_GET_LAUNCH_INVITE}
                  data-cta-context="property_card"
                  onClick={() => {
                    trackClickedGetNotifiied({
                      type: "upcoming home",
                      surface: "coming_soon_card",
                      notification_type: "upcoming home",
                      cta_id: CTA_IDS.PROPERTY_GET_LAUNCH_INVITE,
                      property_id: property.fieldData?.pid || property.id,
                      property_name: property.fieldData.name,
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  Get Launch Invite
                </Button>
                <NotificationModal
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  title="Get Launch Invite"
                  description={`Get notified when ${property.fieldData.name.split(",")[0]} gets available`}
                  notificationType="upcoming home"
                  propertyId={property.fieldData?.pid || property.id}
                  propertyName={property.fieldData.name}
                  submitLabel="Get Invite"
                  submitCtaId={CTA_IDS.PROPERTY_GET_LAUNCH_INVITE}
                  surface="coming_soon_card"
                  journeyMapSessionId={mapJourneySessionId}
                />
                {(() => {
                  const lat = parseFloat(property.fieldData["map-latitude"] || "0");
                  const lng = parseFloat(property.fieldData["map-longitude"] || "0");
                  const hasCoordinates = lat !== 0 && lng !== 0;

                  if (!hasCoordinates) return null;

                  return (
                    <UpcomingPropertyMapModal
                      isOpen={isMapModalOpen}
                      onClose={() => setIsMapModalOpen(false)}
                      onGetLaunchInvite={() => {
                        trackClickedGetNotifiied({
                          type: "upcoming home",
                          surface: "coming_soon_card",
                          notification_type: "upcoming home",
                          cta_id: CTA_IDS.PROPERTY_GET_LAUNCH_INVITE,
                          property_id: property.fieldData?.pid || property.id,
                          property_name: property.fieldData.name,
                        });
                        setIsMapModalOpen(false);
                        setIsDialogOpen(true);
                      }}
                      onMapSessionStart={(sessionId) =>
                        setMapJourneySessionId(sessionId)
                      }
                      propertyId={property.fieldData?.pid || property.id}
                      propertyName={property.fieldData.name}
                      propertyTitle={property.fieldData.name.split(",")[0]}
                      locationName={locationName || "Bangalore"}
                      latitude={lat}
                      longitude={lng}
                    />
                  );
                })()}
              </div>
            </>
          ) : (
            /* Default Variant Content */
            <>
              {/* Availability & Tags */}
              <div className="flex items-center gap-3 flex-wrap">
                <Available
                    rooms={propertyRooms}
                />
                {property.fieldData["female-only"] && (
                  <span className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-xs font-bold font-body">
                    Female Only
                  </span>
                )}
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Stats Row */}
              <div className="flex items-center justify-between text-text-main/80">
                <div className="flex items-center gap-1 md:gap-2">
                  <Bed size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="font-body text-xs font-medium">
                    {property.fieldData["property-bedrooms"]} BHK
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Square
                    size={16}
                    className="rotate-45 md:w-[18px] md:h-[18px]"
                  />
                  <span className="font-body text-xs font-medium">
                    {property.fieldData["carpet-area"]} Sq. Ft
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <DoorOpen size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="font-body text-xs font-medium">
                    {availableRooms}/{totalRooms} Available
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Flatmates Section with CompanyPill */}
              <div className="flex items-center gap-2 md:gap-3 min-w-0 overflow-hidden min-h-[34px]">
                <div className="flex items-center gap-1 md:gap-2 text-text-main/80 flex-shrink-0">
                  <Users
                    size={16}
                    className="md:w-[18px] md:h-[18px] flex-shrink-0"
                  />
                  {allRoomsAvailable ? (
                    /* All rooms available */
                    <span className="font-body text-xs font-medium leading-tight">
                      {property.fieldData["property-bedrooms"] === 1
                        ? "All yours, no flatmate sharing"
                        : "You'll be the first occupant in this house"}
                    </span>
                  ) : (
                    <span className="font-body text-xs font-medium whitespace-nowrap leading-tight">
                      Flatmates from
                    </span>
                  )}
                </div>
                {/* Only show company pills if not all rooms are available */}
                {!allRoomsAvailable && (
                  <div className="flex items-center gap-2 overflow-hidden flex-shrink min-w-0">
                    {companies.length > 0 ? (
                      companies.slice(0, 3).map((company, idx) => {
                        const logoFile = getCompanyLogo(company);

                        return (
                          <CompanyPill
                            key={idx}
                            company={company}
                            logoFile={logoFile}
                          />
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400 font-body italic leading-tight">
                        --
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 w-full mt-auto" />

              {/* Price */}
              <div className="pt-2">
                <span className="text-fluid-h3 font-zin text-text-main">
                  From ₹
                  {displayedRent.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-text-main/60 font-body ml-1">
                  / month (per room)
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Available = ({
  rooms,
}: {
  rooms: Room[];
}) => {
  const availableFromText = getAvailabilityDateForProperty(rooms);
  return (
    <div className="flex items-center gap-1 md:gap-2 text-text-main/80">
      <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
      <span className="font-body font-medium text-xs">{availableFromText}</span>
    </div>
  );
};