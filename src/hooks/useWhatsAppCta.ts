"use client";

import { useCallback, useEffect, useState } from "react";
import {
  composeWhatsAppLink,
  getWhatsAppNumber,
  type WhatsAppLinkFormat,
} from "@/lib/whatsapp";
import { getWaxSessionCode } from "@/lib/wax";
import {
  trackWhatsAppCtaClicked,
  WhatsAppCtaSource,
} from "@/lib/posthog-tracking";

/**
 * Props to spread onto a Button (or `<a>`) that opens WhatsApp.
 *
 * `href` is rendered eagerly with the latest known WAX code so copy-link,
 * cmd-click, right-click "open in new tab", and share-link all carry attribution.
 * `onClick` re-reads the WAX code synchronously and rewrites
 * `e.currentTarget.href` so actual click navigation always uses the freshest
 * value. There is no `preventDefault` and no `window.open` — native navigation
 * fires on both desktop and mobile so the WhatsApp app launches correctly.
 */
export interface WhatsAppCtaProps {
  href: string;
  target: "_blank";
  rel: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface WhatsAppTrackingContext {
  source: WhatsAppCtaSource;
  propertySlug?: string;
  propertyName?: string;
  propertyArea?: string;
  ctaId?: string;
}

export interface UseWhatsAppCtaOptions {
  format: WhatsAppLinkFormat;
  tracking?: WhatsAppTrackingContext;
}

/**
 * Hook for WhatsApp CTAs.
 *
 * Subscribes to the `wax:ready` window event dispatched by
 * `public/scripts/wax-attribution.js` after WAX is written to localStorage, so
 * the eager `href` updates as soon as the script finishes initialising. This
 * closes the race where React hydration completes before the attribution script
 * has written its session code.
 *
 * @param message - The message body to prefill (without any WAX marker).
 * @param options - Format ("wa.me" or "api.whatsapp.com") plus optional tracking.
 *
 * @example
 *   const whatsAppProps = useWhatsAppCta(
 *     getPropertyInterestMessage(propertyName),
 *     { format: "wa.me", tracking: { source: "lightbox", propertyName } }
 *   );
 *   <Button {...whatsAppProps} data-cta-id={CTA_IDS.LIGHTBOX_CHAT_WITH_US}>
 *     Chat with us
 *   </Button>
 */
export function useWhatsAppCta(
  message: string,
  options: UseWhatsAppCtaOptions
): WhatsAppCtaProps {
  const { format, tracking } = options;
  const [waxCode, setWaxCode] = useState("");

  useEffect(() => {
    setWaxCode(getWaxSessionCode());
    const onReady = () => setWaxCode(getWaxSessionCode());
    window.addEventListener("wax:ready", onReady);
    return () => window.removeEventListener("wax:ready", onReady);
  }, []);

  const number = getWhatsAppNumber();
  const href = composeWhatsAppLink({ message, format, number, waxCode });

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (tracking) {
        trackWhatsAppCtaClicked({
          source: tracking.source,
          page_location: undefined,
          property_slug: tracking.propertySlug,
          property_name: tracking.propertyName,
          property_area: tracking.propertyArea,
          cta_id: tracking.ctaId,
        });
      }

      e.currentTarget.href = composeWhatsAppLink({
        message,
        format,
        number,
        waxCode: getWaxSessionCode(),
      });
    },
    [message, format, number, tracking]
  );

  return {
    href,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick,
  };
}
