export const SECURED_APP_STORE_URL =
  "https://apps.apple.com/in/app/secured-by-flent/id6757275258";

const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Mobile: open the App Store in a new tab.
 * Desktop: scroll to the QR section (`#download-app`).
 */
export function downloadAppCta(): void {
  if (typeof window === "undefined") return;
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  if (isMobile) {
    window.open(SECURED_APP_STORE_URL, "_blank", "noopener,noreferrer");
    return;
  }
  document.getElementById("download-app")?.scrollIntoView({ behavior: "smooth" });
}
