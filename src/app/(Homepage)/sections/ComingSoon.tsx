"use client";

import React from "react";
import { Property, Location, Room, Occupant } from "@/lib/webflow";
import { isPropertyActive } from "@/lib/property-utils";
import { CardSection } from "@/components/layout/CardSection";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { PhoneSubscribeForm } from "@/components/ui/PhoneSubscribeForm";
import { useSectionViewTracking } from "@/hooks/useSectionViewTracking";

const DEFAULT_TITLE = (
  <>
    See what&apos;s<br className="md:hidden" /> <br className="hidden md:block" />
    <span className="font-zin-italic"> coming next</span>
  </>
);
const DEFAULT_SUBTITLE =
  "Get early access to one of a kind Flent homes";
const DEFAULT_NEWSLETTER_HEADING =
  "Want an email from us every time we launch a home?";

export interface ComingSoonContentProps {
  /** Main heading. Pass a string or React node; defaults to "See what's coming next". */
  title?: React.ReactNode;
  /** Subtitle below the heading. */
  subtitle?: string;
  /** Heading above the newsletter form. */
  newsletterHeading?: string;
}

interface ComingSoonProps extends ComingSoonContentProps {
  properties?: Property[];
  locations?: Location[];
  rooms?: Room[];
  occupants?: Occupant[];
}

export const ComingSoon = ({
  properties = [],
  locations = [],
  rooms = [],
  occupants = [],
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  newsletterHeading = DEFAULT_NEWSLETTER_HEADING,
}: ComingSoonProps) => {
  const comingSoonProperties = properties.filter(
    (p) => p.fieldData["is-upcoming"] && isPropertyActive(p)
  );

  // Track section visibility
  const sectionRef = useSectionViewTracking({
    sectionId: 'coming-soon',
    sectionName: 'Upcoming Homes',
    additionalProperties: {
      property_count: comingSoonProperties.length,
    },
  });

  return (
    <CardSection
      ref={sectionRef}
      id="coming-soon"
      className="bg-ground-brown"
      backgroundPattern="/patterns/endless-clouds.svg"
      patternOpacity={0.03}
      patternMask="to-bottom"
    >
      {/* Top Section - Centered */}
      <div className="flex flex-col items-center text-center mb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="font-heading text-fluid-h2 text-text-invert mb-6">
          {title}
        </h2>

        <p className="text-subtitle !text-text-invert/90 font-body font-medium max-w-2xl">
          {subtitle}
        </p>
      </div>

      {/* Cards Carousel */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 sm:px-6 lg:px-8 pb-8 -mx-4 sm:-mx-6 lg:-mx-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10">
        {comingSoonProperties.map((item, index) => {
          const location = locations.find(
            (l) => l.id === item.fieldData.location
          );
          return (
            <div
              key={item.id}
              className="flex-none w-[85vw] sm:w-[calc(50vw-2rem)] lg:w-[calc(33.33vw-2.5rem)] snap-center"
            >
              <PropertyCard
                property={item}
                index={index}
                locationName={location?.fieldData.name || "Bangalore"}
                variant="coming-soon"
                rooms={rooms}
                occupants={occupants}
              />
            </div>
          );
        })}
      </div>

      {/* Newsletter Section */}
      <div className=" rounded-3xl py-12 px-2 text-center relative z-10">
        <h3 className="font-heading text-fluid-h3 text-text-invert mb-8">
          {newsletterHeading}
        </h3>

        <PhoneSubscribeForm 
          notificationType="all homes" 
          buttonText="Notify Me"
          useEmail={true}
          surface="homepage_newsletter"
        />

        <div className="mb-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
          <div>
            <p className="text-subtitle-sm !text-text-invert/80 font-body leading-relaxed">
              “Everything I liked kept getting rented out. Early access finally
              gave me a chance”
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-subtitle-sm !text-text-invert/80 font-body leading-relaxed">
              “I just subscribed because all their homes are aesthetically
              pleasing”
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-subtitle-sm !text-text-invert/80 font-body leading-relaxed">
              “I used to check the website every day. Now I don’t have FOMO
              anymore”
            </p>
          </div>
        </div>
      </div>
    </CardSection>
  );
};
