"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { ComingSoon } from "@/app/(Homepage)/sections/ComingSoon";
import { CTA_IDS } from "@/lib/cta-ids";
import { trackPropertyCardClick } from "@/lib/posthog-tracking";
import { isPropertyActive, isUpcomingProperty, propertyHasDiscount } from "@/lib/property-utils";
import {
  type Location,
  type Occupant,
  type Property,
  type Room,
} from "@/lib/webflow";

type LocalityHomesSectionProps = {
  area: string;
  properties: Property[];
  locations: Location[];
  rooms: Room[];
  occupants: Occupant[];
};

export function LocalityHomesSection({
  area,
  properties,
  locations,
  rooms,
  occupants,
}: LocalityHomesSectionProps) {
  const normalizedArea = area.trim().toLowerCase();
  const selectedLocation = useMemo(
    () => locations.find((location) => location.fieldData.name.trim().toLowerCase() === normalizedArea),
    [locations, normalizedArea]
  );

  const localityProperties = useMemo(() => {
    if (!selectedLocation) return [];

    return properties
      .filter((property) => isPropertyActive(property))
      .filter((property) => property.fieldData.available)
      .filter((property) => !isUpcomingProperty(property))
      .filter((property) => property.fieldData.location === selectedLocation.id)
      .slice(0, 3);
  }, [properties, selectedLocation]);

  return (
    <section className="pt-10 pb-6">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-fluid-h3 text-text-main">
          Homes in <span className="font-zin-italic">{area}</span>
        </h2>
      </div>

      {localityProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {localityProperties.map((property, index) => (
            <Link
              key={property.id}
              href={`/homes/${property.fieldData.slug}`}
              className="block w-full min-h-96"
              draggable={false}
              onClick={() =>
                trackPropertyCardClick({
                  property_slug: property.fieldData.slug,
                  property_type: propertyHasDiscount(property) ? "discounted" : "standard",
                  page_section: "rent_calculator_more_options",
                  cta_id: CTA_IDS.PROPERTY_CARD,
                })
              }
            >
              <PropertyCard property={property} index={index} rooms={rooms} occupants={occupants} />
            </Link>
          ))}
        </div>
      ) : (
        <ComingSoon
          properties={properties}
          locations={locations}
          rooms={rooms}
          occupants={occupants}
          title={
            <>
              No available homes in{" "}
              <span className="font-zin-italic">{area}</span> right now
            </>
          }
          subtitle="Get early access alerts and we will notify you as soon as matching homes launch."
        />
      )}

      <div className="mt-10 flex justify-center">
        <Button
          href={`/homes?location=${encodeURIComponent(area)}`}
          variant="primary"
          size="lg"
          data-cta-id={CTA_IDS.CAMPAIGN_VIEW_MORE}
          data-cta-context="rent_calculator_locality_homes"
          className="min-w-72 justify-center px-8"
        >
          View more in {area}
        </Button>
      </div>
    </section>
  );
}
