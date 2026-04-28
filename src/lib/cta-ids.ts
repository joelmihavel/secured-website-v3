/**
 * CTA IDs for PostHog tracking
 *
 * Single source of truth for all `cta_id` values sent with the `cta_clicked` event.
 * Use these constants instead of string literals so that:
 *   - Typos are caught at compile time
 *   - Renames are safe (find-all-references)
 *   - The tracking sheet (docs/posthog_cta_tracking_sheet.csv) can be validated against this file
 *
 * --- How tracking works ---
 * - Buttons: Our <Button> component reads data-cta-id (and optional data-cta-context) and sends
 *   cta_clicked on click. Always set data-cta-id={CTA_IDS.X} on tracked Buttons.
 * - Links / other elements: The auto-tracker (cta-auto-tracker.ts) attaches to elements that match
 *   CTA patterns (e.g. links with certain hrefs). It does NOT attach to elements that already have
 *   data-cta-id + ph-no-capture (our Button), so we avoid double-tracking.
 * - For dynamic CTAs (e.g. nav sections, breadcrumbs, location chips), use the helpers below so
 *   IDs stay consistent (e.g. bottomNavSectionCtaId("Rooms") => "bottom_nav_section_rooms").
 *
 * --- When adding a new CTA ---
 * 1. Add the constant here (and a short comment if the ID isn’t self-explanatory).
 * 2. In the component: data-cta-id={CTA_IDS.X} on <Button>, or for links ensure the element
 *    is picked up by the auto-tracker (or set data-cta-id manually).
 * 3. Add a row to docs/posthog_cta_tracking_sheet.csv (event, cta_id, device, location, description).
 *
 * @see docs/posthog_cta_tracking_sheet.csv
 * @see docs/POSTHOG_ATTRIBUTION.md
 */

export const CTA_IDS = {
  // --- Homepage ---
  HERO_EXPLORE_HOMES: "hero_explore_homes",

  // --- Property card (listing, coming soon) ---
  PROPERTY_CARD: "cta_property_card",
  VIEW_ON_MAPS_COMING_SOON: "view-on-maps-coming-soon",
  PROPERTY_GET_LAUNCH_INVITE: "property_get_launch_invite",

  // --- Search / Homes listing ---
  CTA_SEARCH_ALL_LOCATIONS: "cta_search_all_locations",
  CTA_SEARCH_AVAILABLE_TOGGLE: "cta_search_available_toggle",
  CTA_SEARCH_FEMALE_TOGGLE: "cta_search_female_toggle",
  CTA_SEARCH_FULL_HOMES_TOGGLE: "cta_search_full_homes_toggle",

  // --- Property detail: Header ---
  SCROLL_TO_MAPS: "scroll_to_maps",
  CTA_WATCH_A_VIDEO: "cta_watch_a_video",

  // --- Property detail: Photo gallery (GridLightBox) ---
  CTA_SHOW_ALL_IMAGES: "cta_show_all_images",
  CTA_SHARE: "cta_share",
  CTA_COPY_LINK: "cta_copy_link",
  LIGHTBOX_CHAT_WITH_US: "lightbox_chat_with_us",

  // --- Property detail: Room selection ---
  ROOM_UNDERSTAND_RENT: "room_understand_rent",
  ROOM_GET_NOTIFIED: "room_get_notified",
  ROOM_SELECTION_BOOK_TOUR: "room_selection_book_tour",
  ROOM_SELECTION_TALK_TO_US: "room_selection_talk_to_us",
  FULL_HOUSE_SEE_PRICING: "full_house_see_pricing",
  FULL_HOUSE_BOOK_TOUR: "full_house_book_tour",
  FULL_HOUSE_TALK_TO_US: "full_house_talk_to_us",
  FULL_HOUSE_GET_NOTIFIED: "full_house_get_notified",

  // --- Property detail: How it works ---
  HOW_IT_WORKS_TALK_TO_US: "how_it_works_talk_to_us",

  // --- Navbar ---
  NAVBAR_LOGO: "navbar_logo",
  NAVBAR_LOGO_SECURE: "navbar_logo_secure",
  NAVBAR_BACK: "navbar_back",
  NAVBAR_HOMES: "navbar_homes",
  NAVBAR_ABOUT: "navbar_about",
  NAVBAR_CONTACT_US: "navbar_contact_us",
  NAVBAR_SECURED: "navbar_secured",
  NAVBAR_OWNERS: "navbar_owners",
  SECURED_GET_APP: "secured_get_app",

  // --- Footer ---
  FOOTER_PRIVACY: "footer_privacy",
  FOOTER_TERMS: "footer_terms",
  FOOTER_REFUND: "footer_refund",

  // --- Bottom navigation ---
  CALL_US_MOBILE: "call_us_mobile",
  CHAT_WITH_US_MOBILE: "chat_with_us_mobile",
  CHAT_WITH_US_DESKTOP: "chat_with_us_desktop",
  BOTTOM_NAV_TOGGLE: "bottom_nav_toggle",

  // --- Rent calculator drawer ---
  RENT_CALCULATOR_BACK: "rent_calculator_back",
  RENT_CALCULATOR_BREAKDOWN_TOGGLE: "rent_calculator_breakdown_toggle",
  RENT_CALCULATOR_BOOK_TOUR: "rent_calculator_book_tour",
  RENT_CALCULATOR_TALK_TO_US: "rent_calculator_talk_to_us",
  RENT_CALCULATOR_HOME_INVENTORY_CHAT: "rent_calculator_home_inventory_chat",

  // --- Owners / Get started form ---
  FORM_GET_STARTED_BUTTON: "form_get_started_button",
  FORM_GET_STARTED_SUBMIT: "form_get_started_submit",
  FORM_SUBMIT_ANOTHER: "form_submit_another",
  OWNERS_HERO_CTA: "owners_hero_cta",

  // --- About ---
  CTA_CHECK_OPEN_ROLES: "cta_check_open_roles",

  // --- Subscribe forms ---
  PHONE_SUBSCRIBE_SUBMIT: "phone_subscribe_submit",
  EMAIL_SUBSCRIBE_SUBMIT: "email_subscribe_submit",

  // --- Secured page ---
  SECURED_HERO_DOWNLOAD: "secured_hero_download",
  SECURED_VALUE_PROP_DOWNLOAD: "secured_value_prop_download",
  SECURED_APP_STORE: "secured_app_store",
  SECURED_FORM_INVITE: "secured_form_invite",

  // --- Campaign (e.g. HSR) ---
  CAMPAIGN_CALL_US: "campaign_call_us",
  CAMPAIGN_CHAT_WITH_US: "campaign_chat_with_us",
  CAMPAIGN_VIEW_MORE: "campaign-view-more",
} as const;

/** All CTA ID values as a union type (useful for type-safe payloads). */
export type CtaId = (typeof CTA_IDS)[keyof typeof CTA_IDS];

/**
 * Helpers for dynamic CTA IDs (list-driven CTAs: nav sections, breadcrumbs, search locations, neighborhoods).
 * Use these so IDs are consistent and documented; add any new pattern here and keep the tracking sheet in sync.
 *
 * Examples:
 *   bottomNavSectionCtaId("Rooms")     => "bottom_nav_section_rooms"
 *   navbarBreadcrumbCtaId("Homes")     => "navbar_breadcrumb_homes"
 *   searchLocationCtaId("indiranagar") => "cta_search_location_indiranagar"
 *   neighborhoodCtaId("HSR Layout")    => "cta_neighborhood_hsr_layout"
 */
export function bottomNavSectionCtaId(sectionName: string): string {
  return `bottom_nav_section_${sectionName.toLowerCase().replace(/\s+/g, "_")}`;
}

export function navbarBreadcrumbCtaId(label: string): string {
  return `navbar_breadcrumb_${label.toLowerCase().replace(/\s+/g, "_")}`;
}

export function searchLocationCtaId(slug: string): string {
  return `cta_search_location_${slug}`;
}

export function neighborhoodCtaId(name: string): string {
  return `cta_neighborhood_${name.toLowerCase().replace(/\s+/g, "_")}`;
}
