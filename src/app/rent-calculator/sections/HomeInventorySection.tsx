"use client";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { CTA_IDS } from "@/lib/cta-ids";
import { buildWhatsAppApiLink } from "@/lib/whatsapp";
import { useWhatsAppCta } from "@/hooks/useWhatsAppCta";

const HOME_INVENTORY_WHATSAPP_MESSAGE =
  "Curious to know more about Flent-tell me everything!";

export function HomeInventorySection() {
  const whatsAppCta = useWhatsAppCta(
    buildWhatsAppApiLink(HOME_INVENTORY_WHATSAPP_MESSAGE),
    {
      source: "rent_calculator",
      ctaId: CTA_IDS.RENT_CALCULATOR_HOME_INVENTORY_CHAT,
    }
  );

  return (
    <section className="mt-5">
      <div className="rounded-xl bg-ground-brown/10 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-3">
          <div className="text-left lg:flex lg:h-full lg:flex-col lg:justify-center">
            <h1 className="text-fluid-h3 font-zin text-text-main">
              A complete home vs
              <br />
              Just the basics
            </h1>
            <p className="mt-3 text-subtitle-sm text-text-main/80">
              Going home feels effortless because everything you need is already there. Flent brings
              that same feeling to renting.
            </p>
            <Button
              {...whatsAppCta}
              variant="primary"
              size="md"
              leftIcon={<WhatsAppIcon />}
              className="mt-4 hidden w-fit lg:inline-flex"
              data-cta-id={CTA_IDS.RENT_CALCULATOR_HOME_INVENTORY_CHAT}
              data-cta-context="rent_calculator_home_inventory"
            >
              Chat with us
            </Button>
          </div>

          <div className="rounded-xl bg-ground-brown/12 p-4">
            <div className="font-zin text-fluid-h2 text-text-main">200+</div>
            <div className="text-subtitle-sm font-heading text-text-main">items included with Flent</div>

            <div className="mt-3 space-y-2 text-subtitle-sm text-text-main">
              <div>
                <p className="mb-0.5 text-subtitle-sm font-heading text-text-main/80">
                  Furniture
                </p>
                <p>Bed, mattress, wardrobe, desk, chair, sofa, 4-seater dining</p>
              </div>
              <div>
                <p className="mb-0.5 text-subtitle-sm font-heading text-text-main/80">
                  Appliances
                </p>
                <p>AC, washing machine, microwave, grinder, water purifier</p>
              </div>
              <div>
                <p className="mb-0.5 text-subtitle-sm font-heading text-text-main/80">
                  Kitchen
                </p>
                <p>Cookware, cutlery, crockery, full utensil set</p>
              </div>
              <div>
                <p className="mb-0.5 text-subtitle-sm font-heading text-text-main/80">
                  Essentials
                </p>
                <p>Curtains, bedsheets, pillows, cleaning supplies, drying rack, Wi-Fi router</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-ground-brown/12 p-4">
            <div className="font-zin text-fluid-h2 text-text-main">8</div>
            <div className="text-subtitle-sm font-heading text-text-main">items rented</div>

            <div className="mt-3 space-y-2 text-subtitle-sm text-text-main">
              <p>Bed, mattress, wardrobe, desk, chair, sofa, dining table, washing machine.</p>
              <p className="text-text-main/80">No kitchenware, curtains, bedsheets, or appliances.</p>
              <p className="text-text-main/80">via Furlenco, Rentomojo, Cityfurnish</p>
            </div>
          </div>

          <div className="lg:hidden">
            <Button
              {...whatsAppCta}
              variant="primary"
              size="md"
              leftIcon={<WhatsAppIcon />}
              className="w-fit"
              data-cta-id={CTA_IDS.RENT_CALCULATOR_HOME_INVENTORY_CHAT}
              data-cta-context="rent_calculator_home_inventory"
            >
              Chat with us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
