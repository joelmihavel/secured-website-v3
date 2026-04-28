"use client";

import { useState } from "react";
import { IconCheck as Check, IconX as X } from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { CTA_IDS } from "@/lib/cta-ids";
import { buildWhatsAppApiLink } from "@/lib/whatsapp";
import { useWhatsAppCta } from "@/hooks/useWhatsAppCta";
import type { ComparisonMode } from "../types";

const BEYOND_NUMBERS_WHATSAPP_MESSAGE =
  "Curious to know more about Flent-tell me everything!";

type BeyondNumbersSectionProps = {
  mode: ComparisonMode;
  withItems: string[];
  withoutItems: string[];
};

type MobileTab = "withFlent" | "traditional";

function ListRow({
  text,
  variant,
}: {
  text: string;
  variant: "withFlent" | "traditional";
}) {
  const isWithFlent = variant === "withFlent";
  const Icon = isWithFlent ? Check : X;

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span
        className={
          isWithFlent
            ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pastel-green text-forest-green"
            : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pastel-red text-brick-red"
        }
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="text-subtitle-sm font-medium text-text-main">{text}</p>
    </div>
  );
}

function BeyondNumbersSectionContent({
  withItems,
  withoutItems,
}: Pick<BeyondNumbersSectionProps, "withItems" | "withoutItems">) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("withFlent");
  const whatsAppCta = useWhatsAppCta(
    buildWhatsAppApiLink(BEYOND_NUMBERS_WHATSAPP_MESSAGE),
    {
      source: "rent_calculator",
      ctaId: CTA_IDS.RENT_CALCULATOR_HOME_INVENTORY_CHAT,
    }
  );

  const maxRows = Math.max(withItems.length, withoutItems.length);

  return (
    <section className="mt-8">
      <div className="px-4 md:px-6">
        <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:items-center md:gap-8 lg:grid-cols-3 lg:items-center lg:gap-4">
          <div className="order-2 flex flex-col gap-5 md:order-1 md:gap-0 lg:col-span-2">
            <div className="md:hidden">
              <div className="mb-4 flex justify-center">
                <Tabs
                  value={mobileTab}
                  onValueChange={(value) => setMobileTab(value as MobileTab)}
                  variant="pill"
                  className="w-full max-w-md"
                >
                  <TabsList className="flex w-full">
                    <TabsTrigger value="withFlent" className="!w-1/2 flex-1 md:!w-1/2">
                      Flent
                    </TabsTrigger>
                    <TabsTrigger value="traditional" className="!w-1/2 flex-1 md:!w-1/2">
                      Traditional Renting
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-bg-white">
                {(mobileTab === "withFlent" ? withItems : withoutItems).map((item) => (
                  <ListRow
                    key={`${mobileTab}-${item}`}
                    text={item}
                    variant={mobileTab === "withFlent" ? "withFlent" : "traditional"}
                  />
                ))}
              </div>
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-border bg-bg-white md:block">
              <div className="grid grid-cols-2 border-b border-border bg-bg-white">
                <div className="flex items-center border-r border-border px-4 py-3">
                  <p className="text-subtitle-sm font-semibold text-text-main">With Flent</p>
                </div>
                <div className="flex items-center px-4 py-3">
                  <p className="text-subtitle-sm font-semibold text-text-main">Traditional Renting</p>
                </div>
              </div>

              {Array.from({ length: maxRows }).map((_, index) => (
                <div key={`desktop-row-${index}`} className="grid grid-cols-2">
                  <div className="border-r border-border">
                    {withItems[index] ? <ListRow text={withItems[index]} variant="withFlent" /> : null}
                  </div>
                  <div>
                    {withoutItems[index] ? <ListRow text={withoutItems[index]} variant="traditional" /> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 space-y-2 p-6 text-center md:order-2 md:text-left lg:col-span-1">
            <h3 className="font-heading text-fluid-h3 text-text-main">Traditional renting comes with baggage.</h3>
            <p className="font-zin-italic text-subtitle-xl text-forest-green">Flent doesn’t.</p>
            <p className="text-subtitle-sm text-text-main/70">From move-in to maintenance, Flent removes the hassles you’d usually inherit, because home should not come with brokers, surprises, and endless admin.</p>
            <Button
              {...whatsAppCta}
              variant="primary"
              size="md"
              leftIcon={<WhatsAppIcon />}
              className="mt-4 hidden w-fit md:inline-flex"
              data-cta-id={CTA_IDS.RENT_CALCULATOR_HOME_INVENTORY_CHAT}
              data-cta-context="rent_calculator_beyond_numbers"
            >
              Chat with us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BeyondNumbersSection({ mode, withItems, withoutItems }: BeyondNumbersSectionProps) {
  return <BeyondNumbersSectionContent key={mode} withItems={withItems} withoutItems={withoutItems} />;
}
