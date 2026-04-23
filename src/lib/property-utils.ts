import { Property, Room } from "@/lib/webflow";

/**
 * TEMPORARY: We originally filtered properties using an `Active` boolean from Webflow:
 * `property.fieldData.Active === true`.
 *
 * However, the current Webflow response for the Properties collection does not
 * include an `Active` field at all (only `available`, `is-upcoming`, etc.).
 * That meant this check was filtering out every property locally even though
 * data exists in CMS and on the live site.
 *
 * Until the CMS is updated to add/populate an `Active` field (and this function
 * is wired back to it), we intentionally treat all properties as "active" here
 * so that local and production behaviour match.
 *
 * When you add the `Active` field in Webflow, restore the strict check below:
 *
 *   return property.fieldData.Active === true;
 */
export function isPropertyActive(property: Property): boolean {
  // Temporarily disable the strict Active flag check.
  // See the detailed explanation in the comment above.
  return true;
}

/** True when Webflow marks the property as upcoming (excluded from /homes browse and homepage carousel). */
export function isUpcomingProperty(property: Property): boolean {
  return Boolean(property.fieldData["is-upcoming"]);
}

export interface PhotoCategory {
    name: string;
    images: string[];
}

export const getPropertyImagesData = (property: Property, rooms: Room[]) => {
    // Get all property photos
    const photos = property.fieldData["property-photos"] || [];
    const thumbnailUrl = property.fieldData["property-thumbnail"]?.url;
    const featuredUrl = property.fieldData["property-featured-photo"]?.url;

    // Build image array (Common Areas + Rooms)
    const allImages = [
        thumbnailUrl,
        featuredUrl,
        ...photos.map(p => p.url),
        ...rooms.flatMap(room => {
            const gallery = room.fieldData["image-gallery"] || [];
            const featureImage = room.fieldData["feature-image"];
            return featureImage ? [featureImage, ...gallery] : gallery;
        }).map(img => img.url)
    ].filter(Boolean) as string[];

    // Build photo categories from rooms
    const roomCategories = rooms.map(room => {
        const gallery = room.fieldData["image-gallery"] || [];
        const featureImage = room.fieldData["feature-image"];
        const roomImages = featureImage ? [featureImage, ...gallery] : gallery;

        return {
            name: room.fieldData["room-name"] || room.fieldData.name || "Room",
            images: roomImages.map(img => img.url)
        };
    }).filter(category => category.images.length > 0);

    // Create Common Areas category from property photos
    const commonAreaImages = [
        thumbnailUrl,
        featuredUrl,
        ...photos.map(p => p.url)
    ].filter(Boolean) as string[];

    const commonAreasCategory = {
        name: "Common Areas",
        images: commonAreaImages
    };

    // Combine categories: Common Areas first, then Rooms
    const photoCategories = [
        ...(commonAreaImages.length > 0 ? [commonAreasCategory] : []),
        ...roomCategories
    ];

    return {
        allImages,
        photoCategories,
        commonAreaImages
    };
};

export const ADD_ONS = [
    { name: "Maid", price: 1000, unit: "/mo" },
    { name: "Electricity", price: 800, unit: "/mo" },
    { name: "Water", price: 300, unit: "/mo" },
    { name: "Wifi", price: 300, unit: "/mo" },
    { name: "Cook", price: 2000, unit: "/mo" },
    { name: "Car Parking", price: 500, unit: "/mo" },
    { name: "Key", price: 1500, unit: "/key" },
    { name: "Move-In", price: 2000, unit: "" },
    { name: "BGV", price: 600, unit: "" },
];

export interface RentBreakdown {
    baseRent: number | null;
    maintenance: number | null;
    furnishing: number | null;
    convenience: number | null;
    gst: number | null;
    totalRent: number | null;
    deposit: number | null;
    lockInDiscount?: number;
}

export type LockInPeriod = 6 | 9 | 11;

const parseRentValue = (value: string | number | undefined): number => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (!value) return 0;
    const normalized = value.replace(/,/g, "").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const getRoomRentForLockIn = (
    room: Room,
    lockIn: LockInPeriod = 11
): number => {
    if (lockIn === 6) {
        return parseRentValue(room.fieldData["room-rent"]);
    }
    if (lockIn === 9) {
        return (
            parseRentValue(room.fieldData["3-month-cost-2"]) ||
            parseRentValue(room.fieldData["room-rent"])
        );
    }
    return (
        parseRentValue(room.fieldData["6-month-cost-2"]) ||
        parseRentValue(room.fieldData["room-rent"])
    );
};

/**
 * Returns the lowest room rent for a given lock-in period.
 * Includes all rooms (available or not) to keep "From" price stable.
 */
export const getLowestRoomRentForLockIn = (
    rooms: Room[],
    lockIn: LockInPeriod = 11
): number => {
    if (rooms.length === 0) return 0;
    const roomRents = rooms
        .map((room) => getRoomRentForLockIn(room, lockIn))
        .filter((rent) => rent > 0);
    if (roomRents.length === 0) return 0;
    return Math.min(...roomRents);
};

export const getRoomRentBreakdown = (room: Room, lockIn: LockInPeriod = 11): RentBreakdown => {
    // Base rent from HubSpot response
    const baseRent = room.fieldData["base-rent"] ?? null;

    // Calculate discounts based on lock-in
    let lockInDiscount = 0;
    if (lockIn === 9) lockInDiscount = 1000;
    if (lockIn === 11) lockInDiscount = 2000;

    const maintenance = room.fieldData["maintenance"] ?? null;
    const furnishing = room.fieldData["furnishing-cost"] ?? null;
    const convenience = room.fieldData["convenience-fee"] ?? null;
    const gst = room.fieldData["gst"] ?? null;

    // Total Rent = Base Rent + Maintenance + Furnishing + Convenience + GST - Discount
    const totalRent = baseRent !== null
        ? (baseRent + (maintenance ?? 0) + (furnishing ?? 0) + (convenience ?? 0) + (gst ?? 0) - lockInDiscount)
        : null;

    // Get deposit based on lock-in period
    let deposit: number | null = null;
    if (lockIn === 6) {
        deposit = room.fieldData["security-deposit"] ?? null;
    } else if (lockIn === 9) {
        deposit = room.fieldData["9-month-security-deposit"] ?? null;
    } else {
        deposit = room.fieldData["11-month-security-deposit"] ?? null;
    }

    return {
        baseRent,
        maintenance,
        furnishing,
        convenience,
        gst,
        totalRent,
        deposit,
        lockInDiscount
    };
};

export const getPropertyDisplayRent = (property: Property): number => {
    if (property.fieldData["6-month-lock-in"]) {
        return Number(property.fieldData["6-month-lock-in"]);
    } else if (property.fieldData["no-lock-in"]) {
        return Number(property.fieldData["no-lock-in"]);
    } else {
        return Number(property.fieldData["rent-in-rupees"] || 0);
    }
};

export const getPropertyRentForLockIn = (property: Property, lockIn: LockInPeriod): number => {
    if (lockIn === 6) return Number(property.fieldData["6-month-lock-in"]) || getPropertyDisplayRent(property);
    if (lockIn === 9) return Number(property.fieldData["3-month-lock-in"]) || Number(property.fieldData["6-month-lock-in"]) || getPropertyDisplayRent(property);
    return Number(property.fieldData["no-lock-in"]) || Number(property.fieldData["6-month-lock-in"]) || getPropertyDisplayRent(property);
};

export const getPropertyRentBreakdown = (property: Property, lockIn: LockInPeriod = 11): RentBreakdown => {
    const baseRent = property.fieldData["base-rent"] ?? null;
    const maintenance = property.fieldData["maintenance"] ?? null;
    const furnishing = property.fieldData["furnishing-fee"] ?? null;
    const convenience = property.fieldData["convenience-fee"] ?? null;
    const gst = property.fieldData["gst"] ?? null;

    const totalRent = getPropertyRentForLockIn(property, lockIn);

    // CMS slugs differ from Room: security-deposit-9-month vs 9-month-security-deposit
    let deposit: number | null = null;
    if (lockIn === 6) {
        deposit = property.fieldData["security-deposit"] ?? null;
    } else if (lockIn === 9) {
        deposit = property.fieldData["security-deposit-9-month"] ?? null;
    } else {
        deposit = property.fieldData["security-deposit-11-month"] ?? null;
    }

    // Lock-in discount = difference between 6-month rent (highest) and the selected lock-in rent
    const sixMonthRent = Number(property.fieldData["6-month-lock-in"]) || getPropertyDisplayRent(property);
    const lockInDiscount = Math.max(0, sixMonthRent - totalRent);

    return {
        baseRent,
        maintenance,
        furnishing,
        convenience,
        gst,
        totalRent,
        deposit,
        lockInDiscount
    };
};

export const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return "Not found";
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

function getPropertyDiscountContext(property: Property, allRooms: Room[]) {
    const discountPercentRaw = Number(property.fieldData["discount"]) || 0;
    const discountPercent = discountPercentRaw > 0 ? discountPercentRaw : 0;
    const rawDiscountEndDate = property.fieldData["discount-end-date"];
    const discountEndDate = rawDiscountEndDate ? new Date(rawDiscountEndDate as string) : null;
    const hasValidDiscountEndDate = Boolean(
        discountEndDate && !Number.isNaN(discountEndDate.getTime())
    );

    const now = new Date();
    const discountEndOfDay = hasValidDiscountEndDate
        ? new Date(discountEndDate as Date)
        : null;
    if (discountEndOfDay) {
        discountEndOfDay.setHours(23, 59, 59, 999);
    }

    const isDiscountDateActive = discountEndOfDay
        ? discountEndOfDay.getTime() >= now.getTime()
        : false;
    const isDiscounted = discountPercent > 0 && isDiscountDateActive;

    const propertyRoomIds = property.fieldData.rooms || [];
    const propertyRooms = allRooms.filter((r) => propertyRoomIds.includes(r.id));

    const highestRoomRentAny =
        propertyRooms.length === 0
            ? 0
            : Math.max(...propertyRooms.map((r) => Number(r.fieldData["room-rent"]) || 0));

    const availableRooms = propertyRooms.filter((r) => r.fieldData.available);
    const highestRoomRentAvailable =
        availableRooms.length === 0
            ? 0
            : Math.max(...availableRooms.map((r) => Number(r.fieldData["room-rent"]) || 0));

    return {
        isDiscounted,
        discountPercent,
        highestRoomRentAny,
        highestRoomRentAvailable,
    };
}

export function propertyHasDiscount(property: Property): boolean {
    // NOTE: propertyHasDiscount intentionally does not depend on rooms.
    return getPropertyDiscountContext(property, []).isDiscounted;
}

/**
 * Savings (₹) for the discount ribbon: property discount % applied to the
 * direct room price (room-rent) of the most expensive *available* room.
 * Lock-in is not used.
 */
export function getRibbonDiscountSavings(property: Property, allRooms: Room[]): number {
    const ctx = getPropertyDiscountContext(property, allRooms);
    if (!ctx.isDiscounted) return 0;
    if (ctx.highestRoomRentAvailable === 0) return 0;
    return Math.round(ctx.highestRoomRentAvailable * (ctx.discountPercent / 100));
}

export function getDiscountEndDateFormatted(property: Property): string | null {
    const raw = property.fieldData["discount-end-date"];
    if (!raw) return null;
    return new Date(raw as string).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
    });
}

export function getDiscountSavings(property: Property, allRooms: Room[]): number {
    const ctx = getPropertyDiscountContext(property, allRooms);
    if (!ctx.isDiscounted) return 0;
    if (ctx.highestRoomRentAny === 0) return 0;
    return Math.round(ctx.highestRoomRentAny * (ctx.discountPercent / 100));
}

export const sortProperties = (a: Property, b: Property): number => {
    // 1. Ranking Order (Ascending)
    const rankA = a.fieldData["ranking-order"];
    const rankB = b.fieldData["ranking-order"];

    if (rankA !== undefined && rankB !== undefined) {
        return rankA - rankB;
    }
    if (rankA !== undefined) return -1;
    if (rankB !== undefined) return 1;

    // 2. Availability Date (Earliest first)
    const dateAStr = a.fieldData["available-from"];
    const dateBStr = b.fieldData["available-from"];

    const effectiveDateA = dateAStr ? new Date(dateAStr).getTime() : (a.fieldData.available ? 0 : Infinity);
    const effectiveDateB = dateBStr ? new Date(dateBStr).getTime() : (b.fieldData.available ? 0 : Infinity);

    if (effectiveDateA !== effectiveDateB) {
        return effectiveDateA - effectiveDateB;
    }

    // 3. Properties with images
    const hasImagesA = Boolean(
        a.fieldData["property-thumbnail"]?.url ||
        a.fieldData["property-featured-photo"]?.url ||
        a.fieldData["property-photos"]?.some(p => p.url)
    );
    const hasImagesB = Boolean(
        b.fieldData["property-thumbnail"]?.url ||
        b.fieldData["property-featured-photo"]?.url ||
        b.fieldData["property-photos"]?.some(p => p.url)
    );

    if (hasImagesA !== hasImagesB) {
        return hasImagesA ? -1 : 1;
    }

    return 0;
};

export const sortByAvailabilityThenRank = (a: Property, b: Property): number => {
    const aAvailable = Boolean(a.fieldData.available);
    const bAvailable = Boolean(b.fieldData.available);
    if (aAvailable !== bAvailable) return aAvailable ? -1 : 1;
    return sortProperties(a, b);
};

/* Disabled: combine CMS Locality + Area (location) for card/header labels. Re-enable when needed.
import type { Locality, Location } from "@/lib/webflow";

export function formatPropertyLocalityDisplay(
    localityName?: string | null,
    areaName?: string | null
): string | undefined {
    const locality = localityName?.trim();
    const area = areaName?.trim();
    if (locality && area) return `${locality}, ${area}`;
    if (locality) return locality;
    if (area) return area;
    return undefined;
}

export function getPropertyLocalityAndAreaNames(
    property: Property,
    locations: Location[],
    localities: Locality[]
): { localityName?: string; areaName?: string } {
    const localityId = property.fieldData.locality;
    const locationId = property.fieldData.location;
    const localityName =
        localityId != null && String(localityId).length > 0
            ? localities.find((l) => l.id === localityId)?.fieldData.name
            : undefined;
    const areaName =
        locationId != null && String(locationId).length > 0
            ? locations.find((l) => l.id === locationId)?.fieldData.name
            : undefined;
    return { localityName, areaName };
}
*/
