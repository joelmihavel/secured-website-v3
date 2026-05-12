/**
 * The default WhatsApp prefill message used when no property-specific context exists.
 * Pass this to `useWhatsAppCta` or `getWhatsAppLinkNow`; never wrap it in a builder
 * at module load time (the resulting URL would freeze before WAX is available).
 */
export const DEFAULT_INTEREST_MESSAGE =
  "Curious to know more about Flent—tell me everything!";

/**
 * Returns the WhatsApp prefill message body for a given property name.
 *
 * Note: this is the *message*, not a URL. Pass it through `useWhatsAppCta` (for
 * anchors) or `getWhatsAppLinkNow` (for imperative callers) so the URL is built
 * with the current WAX attribution code.
 */
export const getPropertyInterestMessage = (name: string): string =>
  `Hey, I am interested in ${name}`;

export const DEMAND_OPS_PHONE = "tel:+918123659925";

export const OCCUPIED_LABEL = "Occupied";
export const AVAILABLE_NOW_LABEL = "Available Now";
