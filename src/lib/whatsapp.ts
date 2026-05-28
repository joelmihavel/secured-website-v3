import { FLENT_WHATSAPP_NUMBER } from "@/constants";
import { getWaxSessionCode } from "@/lib/wax";

function sanitizeWhatsappNumber(value: string | undefined): string {
  return (value || "").replace(/\D/g, "");
}

export function getWhatsAppNumber(): string {
  return FLENT_WHATSAPP_NUMBER;
}

export type WhatsAppLinkFormat = "wa.me" | "api.whatsapp.com";

export interface ComposeWhatsAppLinkParams {
  message: string;
  format: WhatsAppLinkFormat;
  number: string;
  waxCode?: string;
}

/**
 * The single seam for producing a WhatsApp click-to-chat URL.
 *
 * Pure function: given a message, format, phone number, and optional WAX attribution
 * code, returns the final URL. If `waxCode` is non-empty and the message text does
 * not already contain a `[WAX-...]` marker, the code is appended to the message body.
 *
 * Every WhatsApp CTA in the app flows through this function (via the hook
 * `useWhatsAppCta` for anchors or `getWhatsAppLinkNow` for imperative callers).
 */
export function composeWhatsAppLink({
  message,
  format,
  number,
  waxCode,
}: ComposeWhatsAppLinkParams): string {
  const base =
    format === "wa.me"
      ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send/?phone=${number}&text=${encodeURIComponent(
          message
        )}&type=phone_number&app_absent=0`;

  if (!waxCode) return base;

  try {
    const parsed = new URL(base);
    const text = parsed.searchParams.get("text") || "";
    if (text.includes("[WAX-")) return base;
    parsed.searchParams.set("text", `${text}${text ? " " : ""}[${waxCode}]`);
    return parsed.toString();
  } catch {
    return base;
  }
}

/**
 * Synchronous adapter for imperative callers (e.g. `window.open` inside a click
 * handler that isn't backed by an anchor).
 *
 * Reads the WhatsApp number from env and the current WAX session code from
 * localStorage, then delegates to `composeWhatsAppLink`. Safe to call during SSR;
 * `getWaxSessionCode` returns an empty string when `window` is undefined, so the
 * URL is returned without a WAX marker.
 */
export function getWhatsAppLinkNow(
  message: string,
  options: { format: WhatsAppLinkFormat }
): string {
  return composeWhatsAppLink({
    message,
    format: options.format,
    number: getWhatsAppNumber(),
    waxCode: getWaxSessionCode(),
  });
}

/**
 * Legacy wrapper for surfaces that still pre-build a WhatsApp URL without
 * attribution (e.g. the Secured pages, which embed a placeholder WAX marker
 * inside the message body itself). New code should prefer `useWhatsAppCta` or
 * `getWhatsAppLinkNow` so attribution is wired up automatically.
 */
export function buildWhatsAppWaMeLink(message: string): string {
  return composeWhatsAppLink({
    message,
    format: "wa.me",
    number: getWhatsAppNumber(),
  });
}

/**
 * Legacy wrapper. See `buildWhatsAppWaMeLink` for guidance.
 */
export function buildWhatsAppApiLink(message: string): string {
  return composeWhatsAppLink({
    message,
    format: "api.whatsapp.com",
    number: getWhatsAppNumber(),
  });
}

export function buildLandlordWhatsAppApiLink(message: string): string {
  const landlordNumber = sanitizeWhatsappNumber(
    process.env.LANDLORD_WHATSAPP_NUMBER
  ) || getWhatsAppNumber();
  return composeWhatsAppLink({
    message,
    format: "api.whatsapp.com",
    number: landlordNumber,
  });
}
