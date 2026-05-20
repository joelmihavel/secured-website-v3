import {
  getCollectionItems,
  COLLECTIONS,
  Property,
  Location,
  Review,
  Amenity,
  Room,
  Occupant,
} from "@/lib/webflow";
import {
  isPropertyActive,
} from "@/lib/property-utils";
import { PropertyPageViewTracker } from "./PropertyPageViewTracker";
import { Header } from "./sections/Header";
import { RoomSelection } from "./sections/RoomSelection";
import { Neighborhood } from "./sections/Neighborhood";
import {
  FlentCompare,
  DEFAULT_WITH_FLENT_ITEMS,
  DEFAULT_WITHOUT_FLENT_ITEMS,
  DEFAULT_FLENT_COMPARE_CONTENT,
} from "./sections/FlentCompare";
import { Rating } from "@/components/ui/Rating";
import { FAQ } from "./sections/FAQ";
import { MoreOptions } from "./sections/MoreOptions";
import { MarqueeSection, MARQUEE_DEFAULT_PROPS } from "@/components/sections/MarqueeSection";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { DrawerOpenProvider } from "@/context/DrawerOpenContext";
import { BreadcrumbSetter } from "@/components/utils/BreadcrumbSetter";
import { Amenities } from "./sections/Amenities";
import { HowItWorks } from "./sections/HowItWorks";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Marquee } from "@/components/ui/Marquee";
import { buildPropertyPageContext } from "./buildPropertyPageContext";

const baseTitle = "Flent | India's New Standard of Renting";
const baseDescription =
  "Unlock India's top 1% rental homes with Flent. Fully furnished, designer homes with no broker hassles and minimal security deposit. Just bring your clothes, and you're home.";

export async function generateStaticParams() {
  const properties = await getCollectionItems<Property>(COLLECTIONS.PROPERTIES);
  const activeProperties = properties.filter(isPropertyActive);
  return activeProperties.map((property) => ({
    slug: property.fieldData.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const properties = await getCollectionItems<Property>(COLLECTIONS.PROPERTIES);
    const activeProperties = properties.filter(isPropertyActive);
    const property = activeProperties.find((p) => p.fieldData.slug === slug);

    if (!property) {
      return {
        title: baseTitle,
        description: baseDescription,
      };
    }

    const propertyName = property.fieldData.name;
    const title = `${propertyName} | ${baseTitle}`;
    const description =
      property.fieldData["property-description"] ||
      property.fieldData["property-long-description"] ||
      baseDescription;

    const ogImage =
      property.fieldData["property-photos"]?.[0]?.url ||
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.flent.in"}/images/og-image.jpg`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage,
      },
    };
  } catch {
    // On API failure, return default metadata (don't block rendering)
    return {
      title: baseTitle,
      description: baseDescription,
    };
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [properties, locations, reviews, allAmenities, allRooms, allOccupants] =
    await Promise.all([
      getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
      getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
      getCollectionItems<Review>(COLLECTIONS.REVIEWS),
      getCollectionItems<Amenity>(COLLECTIONS.AMENITIES),
      getCollectionItems<Room>(COLLECTIONS.ROOMS),
      getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS),
    ]);

  const ctx = buildPropertyPageContext({
    slug,
    properties,
    locations,
    reviews,
    amenities: allAmenities,
    rooms: allRooms,
    occupants: allOccupants,
  });

  if (!ctx.property || !ctx.isValidProperty) {
    notFound();
  }

  const {
    property,
    location,
    propertyAmenities,
    propertyRooms,
    propertyOccupants,
    neighborhoodProperties,
    allImages,
    photoCategories,
    propertyType,
    hasDiscount,
    discountSavings,
    discountEndDate,
  } = ctx;

  return (
    <DrawerOpenProvider>
    <main className="min-h-screen bg-bg-white flex flex-col gap-12">
      <PropertyPageViewTracker
        propertySlug={slug}
        propertyType={propertyType}
        propertyArea={location?.fieldData.name}
      />
      {location && (
        <BreadcrumbSetter
          neighborhoodName={location.fieldData.name}
          neighborhoodId={location.id}
        />
      )}
      <div className="flex flex-col gap-0">
        <section id="overview">
          <Header
          rooms={propertyRooms}
            property={property}
            amenities={propertyAmenities}
            allImages={allImages}
            photoCategories={photoCategories}
            locationName={location?.fieldData.name}
          />
        </section>

        {hasDiscount && discountSavings > 0 && (
          <section aria-label="Discount offer marquee" className="bg-bg-white">
            <div className="border-y border-text-main py-3">
              <Marquee
                className="gap-4 items-center"
                duration={20}
              >
              {/* Leading star separator */}
              <div className="mx-2 inline-flex items-center justify-center w-10 h-10 rounded-full animate-spin [animation-duration:25s] [animation-timing-function:linear] md:[animation-duration:20s]">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    stroke: "var(--color-text-main)",
                    fill: "var(--color-forest-green)",
                  }}
                >
                  <path
                    d="M12 2.5L14.9443 8.27179L21.25 9.20871L16.625 13.5718L17.7639 19.7913L12 16.875L6.23607 19.7913L7.375 13.5718L2.75 9.20871L9.05573 8.27179L12 2.5Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Content 1 */}
              <div className="px-2 text-text-main font-heading text-subtitle-xl md:text-fluid-h4 whitespace-nowrap">
                Early Bird Discount
              </div>

              {/* Star separator */}
              <div className="mx-2 inline-flex items-center justify-center w-10 h-10 rounded-full animate-spin [animation-duration:25s] [animation-timing-function:linear] md:[animation-duration:20s]">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    stroke: "var(--color-text-main)",
                    fill: "var(--color-forest-green)",
                  }}
                >
                  <path
                    d="M12 2.5L14.9443 8.27179L21.25 9.20871L16.625 13.5718L17.7639 19.7913L12 16.875L6.23607 19.7913L7.375 13.5718L2.75 9.20871L9.05573 8.27179L12 2.5Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Content 2 */}
              <div className="px-2 text-text-main font-heading text-subtitle-xl md:text-fluid-h4 whitespace-nowrap">
                Save up to ₹{discountSavings.toLocaleString("en-IN")} every month
              </div>

              {/* Star separator */}
              <div className="mx-2 inline-flex items-center justify-center w-10 h-10 rounded-full animate-spin [animation-duration:25s] [animation-timing-function:linear] md:[animation-duration:20s]">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    stroke: "var(--color-text-main)",
                    fill: "var(--color-forest-green)",
                  }}
                >
                  <path
                    d="M12 2.5L14.9443 8.27179L21.25 9.20871L16.625 13.5718L17.7639 19.7913L12 16.875L6.23607 19.7913L7.375 13.5718L2.75 9.20871L9.05573 8.27179L12 2.5Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Content 3 */}
              <div className="px-2 text-text-main font-heading text-subtitle-xl md:text-fluid-h4 whitespace-nowrap">
                Book before {discountEndDate ?? "the offer ends"} to avail
              </div>
              </Marquee>
            </div>
          </section>
        )}
      </div>

      <section id="rooms">
        <RoomSelection
          property={property}
          rooms={propertyRooms}
          occupants={propertyOccupants}
          allImages={allImages}
          photoCategories={photoCategories}
          slug={slug}
        />
      </section>

      <section id="amenities">
        <Amenities
          property={property}
          amenities={propertyAmenities}
        />
      </section>

      <section id="neighborhood">
        <Neighborhood
          property={property}
          location={location}
          neighborhoodProperties={neighborhoodProperties}
        />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <section id="flent-compare">
        <FlentCompare
          cardSectionId="compare"
          defaultTab="flent"
          withItems={DEFAULT_WITH_FLENT_ITEMS}
          withoutItems={DEFAULT_WITHOUT_FLENT_ITEMS}
          {...DEFAULT_FLENT_COMPARE_CONTENT}
        />
      </section>

      <section id="how-it-works">
        <HowItWorks propertyName={property.fieldData.name} />
      </section>

      <MarqueeSection {...MARQUEE_DEFAULT_PROPS} />

      <section id="reviews">
        <Rating reviews={reviews} />
      </section>

      <MoreOptions
        properties={properties.filter(isPropertyActive)}
        currentPropertyId={property.id}
        rooms={allRooms}
        occupants={allOccupants}
      />

      <BottomNavigation property={property} />
    </main>
    </DrawerOpenProvider>
  );
}
