// Webflow API token is optional at build/runtime. When it's missing or the
// network call fails, we gracefully fall back to empty data so builds don't
// crash (e.g. during Vercel preview builds or local environments without
// network access).
export const WEBFLOW_API_TOKEN = process.env.NEXT_PUBLIC_WEBFLOW_API_TOKEN;
export const SITE_ID = "6593ed11d5ad65d107dfe76c";

export const COLLECTIONS = {
  PROPERTIES: "6593ed11d5ad65d107dfe7af",
  LOCATIONS: "6595a74ba4f6dc705a68fc96",
  /** CMS "Locality" reference on properties (neighbourhood / sub-area). */
  LOCALITIES: "69bb77eba52523e653aea8ca",
  REVIEWS: "6595b72233057094bab0e0c1",
  AMENITIES: "6595a6b3510135f8bf9c4000",
  ROOMS: "6595bb2d446200b72e034d85",
  OCCUPANTS: "6595b92f9526255b091e9f83",
};

// Mapping for Webflow Option IDs to human-readable labels
export const WEBFLOW_OPTION_MAP: Record<string, string> = {
  // Gender
  "8edcf104a279f1328664aa636a7c4a16": "Male",
  "1111d9d30ab26526a3d8f487f60f4524": "Female",

  // Food Preference
  a90e206b628bdff99bc3f0d5e10b4ca5: "Non-Vegetarian",
  "429e0261dda90fba9da3135f0ce5e9a7": "Vegetarian",
  "6595b92f9526255b091e9f85": "Eggetarian", // Example ID

  // Bathroom Type
  "507f486b83cb14ed903e2be4cfdf6676": "Attached Bathroom",
  "27b25f500b8ac59142facd5904f4ede0": "Dedicated Bathroom",
  "24ba094369ba76921d7c1e652584e38b": "Shared Bathroom",
};

// Background Colour
export const WEBFLOW_BACKGROUND_COLOUR_MAP: Record<string, string> = {
  "027bd55e1fb16c02fb176fba15f12520": "bg-forest-green",
  f03f4aba2aba6005b8d10a48f428be41: "bg-ground-brown",
  ebcfbcef531debd76322160d950c6678: "bg-brick-red",
  "5fae35906486e03cd42afc9966930a7e": "bg-night-violet",
  "8f286be0c51e135f9d5ecdb79b939042": "bg-brand-pink",
  "880061f1a3478b451b32f6a18d13aee9": "bg-brand-orange",
  "9c47de84770c009d846f9f3d428d9968": "bg-brand-cyan",
  "5e25d88c2d8d35088170e780c47a0722": "bg-brand-yellow",
};

export const getWebflowOptionLabel = (
  id: string | undefined
): string | undefined => {
  if (!id) return undefined;
  return WEBFLOW_OPTION_MAP[id] || id;
};

export interface WebflowItem {
  id: string;
  cmsLocaleId: string;
  lastPublished: string;
  lastUpdated: string;
  createdOn: string;
  isArchived: boolean;
  isDraft: boolean;
  fieldData: Record<string, unknown>;
}

export interface Property extends WebflowItem {
  fieldData: {
    name: string;
    slug: string;
    "property-thumbnail"?: { url: string; alt?: string };
    "property-photos"?: { url: string; alt?: string }[];
    "property-video"?: { url: string; metadata?: Record<string, unknown> };
    "property-featured-photo"?: { url: string; alt?: string };
    "property-long-description"?: string;
    "property-description"?: string;
    "rent-in-rupees"?: string;
    "property-bedrooms"?: number;
    "property-bathrooms"?: number;
    "carpet-area"?: number;
    "property-is-featured"?: boolean;
    type?: string; // Option ID
    amenities?: string[]; // MultiReference IDs
    rooms?: string[]; // MultiReference IDs
    /** CMS "Locality" — reference to Localities collection. */
    locality?: string; // Reference ID
    /** CMS "Area" — reference to Locations collection. */
    location?: string; // Reference ID
    hotspots?: string[]; // MultiReference IDs
    reviews?: string[]; // MultiReference IDs
    Active?: boolean;
    available?: boolean;
    "available-from"?: string;
    "car-parking"?: boolean;
    "all-inventory"?: string; // Link
    "schedule-link"?: string; // Link
    "female-only"?: boolean;
    "6-month-lock-in"?: string;
    "3-month-lock-in"?: string;
    "no-lock-in"?: string;
    "pid"?: string;
    "full-house-available"?: boolean;
    "floor-number-new"?: string;
    "ranking-order"?: number;
    "map-latitude"?: string;
    "map-longitude"?: string;
    "house-tour"?: { url: string; metadata?: Record<string, unknown> };
    "is-upcoming"?: boolean;
    "background-colour-2"?: string; // BG Option ID
    "apply-discount"?: boolean;
    discount?: number;
    "discount-end-date"?: string;
    "base-rent"?: number;
    "maintenance"?: number;
    "convenience-fee"?: number;
    "furnishing-fee"?: number;
    "gst"?: number;
    "security-deposit"?: number;
    "security-deposit-9-month"?: number;
    "security-deposit-11-month"?: number;
  };
}

export interface Location extends WebflowItem {
  fieldData: {
    name: string;
    slug: string;
    city?: string; // Option ID
    properties?: string[]; // MultiReference IDs
    "unlisted-house"?: string[]; // MultiReference IDs
  };
}

/** Localities collection — linked from Property.fieldData.locality. */
export interface Locality extends WebflowItem {
  fieldData: {
    name: string;
    slug?: string;
  };
}

export interface Review extends WebflowItem {
  fieldData: {
    name: string;
    slug: string;
    message?: string;
    profession?: string;
    "profile-picture"?: { url: string; alt?: string };
    property?: string; // Reference ID
  };
}

export interface Amenity extends WebflowItem {
  fieldData: {
    name: string;
    slug: string;
    icon?: { url: string; alt?: string };
  };
}

export interface Room extends WebflowItem {
  fieldData: {
    name: string;
    slug: string;
    "room-name"?: string;
    "room-rent"?: string;
    "base-rent"?: number;
    maintenance?: number;
    "furnishing-cost"?: number;
    "convenience-fee"?: number;
    gst?: number;
    "3-month-cost-2"?: string;
    "6-month-cost-2"?: string;
    "area-sq-ft"?: number;
    "feature-image"?: { url: string; alt?: string };
    "image-gallery"?: { url: string; alt?: string }[];
    balcony?: boolean;
    "dedicated-workspace"?: boolean;
    available?: boolean;
    "available-from"?: string;
    bathroom?: string; // Option ID
    "bed-tyoe"?: string; // Option ID (typo in Webflow)
    property?: string; // Reference ID to Property
    occupant?: string; // Reference ID to Occupant
    "security-deposit"?: number; // 6-month lock-in deposit
    "9-month-security-deposit"?: number;
    "11-month-security-deposit"?: number;
    "ranking-order"?: number;
  };
}

export interface Occupant extends WebflowItem {
  fieldData: {
    name: string;
    slug: string;
    profession?: string;
    company?: string;
    "profile-picture"?: { url: string; alt?: string };
    gender?: string; // Option ID
    "food-preference"?: string; // Option ID
    smokes?: boolean;
    room?: string; // Reference ID
    property?: string; // Reference ID
  };
}

export class WebflowFetchError extends Error {
  constructor(message: string, public readonly collectionId: string) {
    super(message);
    this.name = "WebflowFetchError";
  }
}

export async function getCollectionItems<T extends WebflowItem>(
  collectionId: string
): Promise<T[]> {
  // If the token is missing, log and return empty so that pages depending
  // on Webflow data can still render (with no items) instead of failing
  // the entire build.
  if (!WEBFLOW_API_TOKEN) {
    console.warn(
      `[Webflow] WEBFLOW_API_TOKEN is not set. Returning empty items for collection ${collectionId}.`
    );
    return [];
  }

  let allItems: T[] = [];
  let offset = 0;
  const limit = 100; // Webflow API limit
  let total = 0;

  do {
    const url = `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${WEBFLOW_API_TOKEN}`,
      },
      next: { revalidate: 3600 }, // 60 minutes
    };

    let response: Response;
    try {
      response = await fetch(url, options);
    } catch (error) {
      console.error(
        `[Webflow] Network error fetching collection ${collectionId} from ${url}. Returning empty list.`,
        error
      );
      return [];
    }

    if (!response.ok) {
      // Instead of throwing (which breaks static generation completely),
      // log and return whatever we have so far.
      console.error(
        `[Webflow] Error fetching collection ${collectionId}: ${response.status} ${response.statusText}. Returning items fetched so far (${allItems.length}).`
      );
      return allItems;
    }

    let data: {
      items?: T[];
      pagination?: { total?: number };
    };
    try {
      data = (await response.json()) as {
        items?: T[];
        pagination?: { total?: number };
      };
    } catch (error) {
      // Webflow occasionally returns malformed JSON for specific content rows.
      // Fail soft and return data fetched so far instead of breaking build.
      console.error(
        `[Webflow] Invalid JSON while fetching collection ${collectionId}. Returning items fetched so far (${allItems.length}).`,
        error
      );
      return allItems;
    }

    if (data.items) {
      allItems = allItems.concat(data.items as T[]);
    }

    total = data.pagination?.total || 0;
    offset += limit;
  } while (offset < total);

  return allItems;
}
