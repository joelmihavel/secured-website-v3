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
import { PhoneRibbonTransition } from "@/components/secured/PhoneRibbonTransition";
import { StorySection } from "@/components/secured/StorySection";
import { RentScoreSection } from "@/components/secured/RentScoreSection";
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
      <main className="flex flex-col gap-6 md:gap-0">
        <Hero data={data.hero} variant={variant} />

        {variant === "tenant" && (
          <>
            <PhoneRibbonTransition
              text1={COMMITMENT_DEFAULTS.marqueeText1}
              text2={COMMITMENT_DEFAULTS.marqueeText2}
            />

            <StorySection />

            <div className="h-[80px] md:h-[120px] lg:h-[160px]" />

            <Commitment data={data.commitment} variant="tenant" />

            <div className="h-[100vh]" />

            <CreditCard data={data.creditCard} />

            <div className="h-[80px]" />

            <RentScoreSection />

            <div className="h-[80px]" />

            <GettingStarted data={data.gettingStarted} />

            <div className="h-[80px]" />

            <TrustSection data={data.trust} />

            <div className="h-[80px]" />

            <RentMapSection />

            <div className="h-[80px]" />

            <DownloadApp data={DOWNLOAD_APP_DEFAULTS} />

            <div className="h-[80px]" />

            <FAQ items={data.faq} />

            <div className="h-[80px]" />

            <Stats data={STATS_DEFAULTS} />
          </>
        )}

        {variant === "landlord" && (
          <>
            <TrustSection data={data.trust} variant="landlord" />
            <Commitment data={data.commitment} variant="landlord" />
            <div className="h-[100px]" />
            <CoverageSection data={COVERAGE_LANDLORD_DEFAULTS} />
            <div className="h-[100px]" />
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
