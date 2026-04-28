import {
  COLLECTIONS,
  getCollectionItems,
  type Location,
  type Occupant,
  type Property,
  type Room,
} from "@/lib/webflow";
import { MarqueeSection, MARQUEE_DEFAULT_PROPS } from "@/components/sections/MarqueeSection";
import { RentCalculatorClient } from "./RentCalculatorClient";
import { Suspense } from "react";

export default async function RentCalculatorPage() {
  const [properties, locations, rooms, occupants] = await Promise.all([
    getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
    getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
    getCollectionItems<Room>(COLLECTIONS.ROOMS),
    getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS),
  ]);

  return (
    <>
      <MarqueeSection {...MARQUEE_DEFAULT_PROPS} />
      <Suspense fallback={null}>
        <RentCalculatorClient
          properties={properties}
          locations={locations}
          rooms={rooms}
          occupants={occupants}
        />
      </Suspense>
    </>
  );
}
