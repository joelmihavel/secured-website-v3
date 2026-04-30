"use client";

import {
  Hero,
  RentMapSection,
  Commitment,
  CreditCard,
  GettingStarted,
  Stats,
  FAQ,
  DownloadApp,
  TrustSection,
  CoverageSection,
  CallbackSection,
} from "@/components/secured";
import { Footer } from "@/components/secured/Footer";
import { HorizontalDivider } from "@/components/secured/HorizontalDivider";
import { InviteTenant } from "@/components/secured/InviteTenant";
import { MarqueeBanner } from "@/components/secured/MarqueeBanner";
import { useVariant } from "./VariantContext";
import {
  HERO_DEFAULTS,
  HERO_LANDLORD_DEFAULTS,
  COMMITMENT_DEFAULTS,
  COMMITMENT_LANDLORD_DEFAULTS,
  CREDIT_CARD_DEFAULTS,
  CREDIT_CARD_LANDLORD_DEFAULTS,
  GETTING_STARTED_DEFAULTS,
  GETTING_STARTED_LANDLORD_DEFAULTS,
  DOWNLOAD_APP_DEFAULTS,
  FAQ_DEFAULTS,
  FAQ_LANDLORD_DEFAULTS,
  STATS_DEFAULTS,
  FOOTER_DEFAULTS,
  TRUST_DEFAULTS,
  TRUST_LANDLORD_DEFAULTS,
  COVERAGE_LANDLORD_DEFAULTS,
  CALLBACK_LANDLORD_DEFAULTS,
} from "@/lib/secured/defaults";

export function SecuredLandingContent() {
  const { variant } = useVariant();
  const data =
    variant === "landlord"
      ? {
          hero: HERO_LANDLORD_DEFAULTS,
          trust: TRUST_LANDLORD_DEFAULTS,
          commitment: COMMITMENT_LANDLORD_DEFAULTS,
          creditCard: CREDIT_CARD_LANDLORD_DEFAULTS,
          gettingStarted: GETTING_STARTED_LANDLORD_DEFAULTS,
          faq: FAQ_LANDLORD_DEFAULTS,
        }
      : {
          hero: HERO_DEFAULTS,
          trust: TRUST_DEFAULTS,
          commitment: COMMITMENT_DEFAULTS,
          creditCard: CREDIT_CARD_DEFAULTS,
          gettingStarted: GETTING_STARTED_DEFAULTS,
          faq: FAQ_DEFAULTS,
        };

  return (
    <div className="relative">
      {/* Persistent vertical border lines — 80px from edges */}
      <div
        className="pointer-events-none absolute bottom-0 top-0 z-[999] hidden lg:block"
        style={{ left: 120, width: "0.3px", backgroundColor: "#4D4D4D" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 top-0 z-[999] hidden lg:block"
        style={{ right: 120, width: "0.3px", backgroundColor: "#4D4D4D" }}
      />

      <main className="flex flex-col gap-6 md:gap-0">
        <Hero data={data.hero} variant={variant} />

        {variant === "tenant" && (
          <>
            <MarqueeBanner
              text1={COMMITMENT_DEFAULTS.marqueeText1}
              text2={COMMITMENT_DEFAULTS.marqueeText2}
            />

            <TrustSection data={data.trust} />

            <RentMapSection />

            <Commitment data={data.commitment} variant="tenant" />

            <CreditCard data={data.creditCard} />

            <GettingStarted data={data.gettingStarted} />

            <DownloadApp data={DOWNLOAD_APP_DEFAULTS} />

            <FAQ items={data.faq} />

            <Stats data={STATS_DEFAULTS} />
          </>
        )}

        {variant === "landlord" && (
          <>
            <HorizontalDivider />
            <TrustSection data={data.trust} variant="landlord" />
            <Commitment data={data.commitment} variant="landlord" />
            <div className="h-[100px] bg-[#131313]" />
            <CoverageSection data={COVERAGE_LANDLORD_DEFAULTS} />
            <CreditCard data={data.creditCard} />
            <div className="h-[100px] bg-[#131313]" />
            <GettingStarted data={data.gettingStarted} variant="landlord" />
            <InviteTenant />
            <FAQ items={data.faq} />
            <Stats data={STATS_DEFAULTS} />
          </>
        )}
      </main>
      <Footer data={FOOTER_DEFAULTS} />
    </div>
  );
}
