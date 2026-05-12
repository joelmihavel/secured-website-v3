const WAX_STORAGE_KEY = "wax_attribution";

/**
 * Reads the WAX session code from localStorage (set by the WAX attribution script
 * in layout). Returns empty string if not present, invalid, or running on the server.
 *
 * The matching write happens in `public/scripts/wax-attribution.js`, which also
 * dispatches a `wax:ready` window event after saving so React subscribers (notably
 * `useWhatsAppCta`) can react without polling.
 */
export function getWaxSessionCode(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = window.localStorage.getItem(WAX_STORAGE_KEY);
    if (!stored) return "";
    const data = JSON.parse(stored) as { sessionCode?: string };
    return data?.sessionCode ?? "";
  } catch {
    return "";
  }
}
