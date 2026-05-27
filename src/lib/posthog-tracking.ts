/**
 * PostHog Tracking Utility
 * 
 * Centralized utility for tracking events to PostHog with comprehensive
 * attribution data including page context, session context, and device info.
 * 
 * This module provides:
 * - CTA click tracking with full attribution data
 * - Automatic extraction of UTM parameters and click IDs (gclid, fbclid, etc.)
 * - Session and device context collection
 * - Integration with PostHog's attribution system
 * 
 * @see {@link https://posthog.com/docs} PostHog Documentation
 * @see {@link docs/POSTHOG_ATTRIBUTION.md} Full Attribution Implementation Guide
 */

import posthog from 'posthog-js';

/**
 * Check if PostHog is available and initialized
 */
export function isPostHogAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof posthog !== 'undefined' && posthog.__loaded === true;
}

/**
 * Extract page context metadata
 */
export function getPageContext(): {
  page_url: string;
  page_path: string;
  page_title: string;
  page_hash?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  gbraid?: string;
  wbraid?: string;
} {
  if (typeof window === 'undefined') {
    return {
      page_url: '',
      page_path: '',
      page_title: '',
    };
  }

  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    page_hash: url.hash || undefined,
    referrer: document.referrer || undefined,
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
    gclid: searchParams.get('gclid') || undefined,
    fbclid: searchParams.get('fbclid') || undefined,
    gbraid: searchParams.get('gbraid') || undefined,
    wbraid: searchParams.get('wbraid') || undefined,
  };
}

/**
 * Extract session context from PostHog
 */
export function getSessionContext(): {
  session_id?: string;
  distinct_id?: string;
} {
  if (!isPostHogAvailable()) {
    return {};
  }

  try {
    return {
      session_id: posthog.get_session_id?.() || undefined,
      distinct_id: posthog.get_distinct_id?.() || undefined,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to get PostHog session context:', error);
    }
    return {};
  }
}

/**
 * Extract device and browser context
 */
export function getDeviceContext(): {
  screen_width: number;
  screen_height: number;
  user_agent: string;
  device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
} {
  if (typeof window === 'undefined') {
    return {
      screen_width: 0,
      screen_height: 0,
      user_agent: '',
      device_type: 'unknown',
    };
  }

  const width = window.screen?.width || 0;

  let device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown' = 'unknown';
  if (width > 0 && width < 768) {
    device_type = 'mobile';
  } else if (width >= 768 && width < 1024) {
    device_type = 'tablet';
  } else if (width >= 1024) {
    device_type = 'desktop';
  }

  return {
    screen_width: width,
    screen_height: window.screen?.height || 0,
    user_agent: navigator.userAgent || '',
    device_type,
  };
}

/**
 * CTA click event data interface
 */
export interface CTAClickData {
  cta_id: string;
  cta_text: string;
  cta_type: 'button' | 'link' | 'form_submit';
  cta_variant?: string;
  cta_destination?: string;
  page_section?: string;
}

/**
 * Track a CTA click event to PostHog
 * 
 * @param ctaData - CTA click data
 * @param additionalProperties - Optional additional properties to include
 */
export function trackCTAClick(
  ctaData: CTAClickData,
  additionalProperties?: Record<string, any>
): void {
  if (!isPostHogAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog is not available. CTA click not tracked.');
    }
    return;
  }

  try {
    const pageContext = getPageContext();
    const sessionContext = getSessionContext();
    const eventProperties = {
      // CTA Identification
      cta_id: ctaData.cta_id,
      cta_text: ctaData.cta_text,
      cta_type: ctaData.cta_type,
      cta_variant: ctaData.cta_variant,
      cta_destination: ctaData.cta_destination,
      page_section: ctaData.page_section,

      // Page Context
      ...pageContext,

      // Session Context
      ...sessionContext,

      // Timestamp
      timestamp: new Date().toISOString(),

      // Additional properties
      ...additionalProperties,
    };

    posthog.capture('cta_clicked', eventProperties);
  } catch (error) {
    console.error('Failed to track CTA click:', error);
  }
}

/**
 * Track a generic event to PostHog with full context
 * 
 * @param eventName - Name of the event
 * @param properties - Event properties
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
): void {
  if (!isPostHogAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`PostHog is not available. Event '${eventName}' not tracked.`);
    }
    return;
  }

  try {
    const pageContext = getPageContext();
    const sessionContext = getSessionContext();
    const eventProperties = {
      // Page Context
      ...pageContext,

      // Session Context
      ...sessionContext,

      // Timestamp
      timestamp: new Date().toISOString(),

      // Custom properties
      ...properties,
    };

    posthog.capture(eventName, eventProperties);
  } catch (error) {
    console.error(`Failed to track event '${eventName}':`, error);
  }
}

/**
 * Payload for search_filters_changed event.
 * Use this to understand filter usage and user preferences on /homes.
 */
export interface SearchFiltersChangedPayload {
  /** Current filter state (serialized for PostHog) */
  min_budget: number;
  max_budget: number;
  location_ids: string[];
  location_names?: string[];
  move_in_date: string;
  female_only: boolean;
  show_full_homes: boolean;
  /** Number of properties matching the current filters */
  result_count: number;
}

const SEARCH_FILTERS_CHANGED_EVENT = 'search_filters_changed';

/**
 * Track when the user changes search filters on /homes.
 * Fired after each filter/toggle change with full state and result count
 * for preference analysis and funnel tuning.
 */
export function trackSearchFiltersChanged(payload: SearchFiltersChangedPayload): void {
  trackEvent(SEARCH_FILTERS_CHANGED_EVENT, payload);
}

/** Filter type for property card click and property page view (discounted vs standard). */
export type PropertyTypeFilter = 'discounted' | 'standard';

type BasePropertyAnalyticsPayload = {
  property_slug: string;
  property_type: PropertyTypeFilter;
  /** Human-readable area / neighbourhood name (Location.fieldData.name). */
  property_area?: string;
};

const PROPERTY_CARD_CLICKED_EVENT = 'property_card_clicked';
const PROPERTY_PAGE_VIEWED_EVENT = 'property_page_viewed';
const HOMES_RENT_CALCULATOR_OPENED_EVENT = 'homes_rent_calculator_opened';
const HOMES_RENT_LOCK_IN_CHANGED_EVENT = 'homes_rent_lock_in_changed';
const RENT_CALCULATOR_VIEWED_EVENT = 'rent_calculator_viewed';
const RENT_CALCULATOR_AREA_SELECTED_EVENT = 'rent_calculator_area_selected';
const RENT_CALCULATOR_MODE_CHANGED_EVENT = 'rent_calculator_mode_changed';
const RENT_CALCULATOR_FURNITURE_MODE_CHANGED_EVENT = 'rent_calculator_furniture_mode_changed';
const RENT_CALCULATOR_INPUT_EDITED_EVENT = 'rent_calculator_input_edited';
const RENT_CALCULATOR_STATE_UPDATED_EVENT = 'rent_calculator_state_updated';
const WHATSAPP_CTA_CLICKED_EVENT = 'whatsapp_cta_clicked';
const HOME_TOUR_CLICKED_EVENT = 'home_tour_clicked';
const FAQ_CLICKED_EVENT = 'faq_clicked';
const CLICKED_GET_NOTIFIIED_EVENT = 'clicked_get_notifiied';
const NOTIFICATION_FORM_STARTED_EVENT = 'notification_form_started';
const NOTIFICATION_FORM_FIELD_COMPLETED_EVENT = 'notification_form_field_completed';
const NOTIFICATION_FORM_SUBMIT_ATTEMPTED_EVENT = 'notification_form_submit_attempted';
const NOTIFICATION_FORM_SUBMIT_SUCCEEDED_EVENT = 'notification_form_submit_succeeded';
const NOTIFICATION_FORM_SUBMIT_FAILED_EVENT = 'notification_form_submit_failed';
const NOTIFICATION_MODAL_CLOSED_EVENT = 'notification_modal_closed';
const UPCOMING_MAP_MODAL_OPENED_EVENT = 'upcoming_map_modal_opened';
const UPCOMING_MAP_INTERACTION_EVENT = 'upcoming_map_interaction';
const UPCOMING_MAP_CTA_CLICKED_EVENT = 'upcoming_map_cta_clicked';
const UPCOMING_MAP_MODAL_CLOSED_EVENT = 'upcoming_map_modal_closed';
const OWNERS_FORM_VIEWED_EVENT = 'owners_form_viewed';
const OWNERS_FORM_STARTED_EVENT = 'owners_form_started';
const OWNERS_FORM_FIELD_COMPLETED_EVENT = 'owners_form_field_completed';
const OWNERS_FORM_SUBMIT_ATTEMPTED_EVENT = 'owners_form_submit_attempted';
const OWNERS_FORM_SUBMIT_SUCCEEDED_EVENT = 'owners_form_submit_succeeded';
const OWNERS_FORM_SUBMIT_FAILED_EVENT = 'owners_form_submit_failed';

function trackWithContext(eventName: string, properties?: Record<string, any>): void {
  trackEvent(eventName, properties);
}

// --- Notification funnel tracking ---
export type NotificationTrackingType =
  | 'upcoming home'
  | 'email newsletter'
  | 'specific property';

export type NotificationSurface =
  | 'coming_soon_card'
  | 'homepage_newsletter'
  | 'property_slug_room'
  | 'property_slug_full_house';

export type NotificationType =
  | 'specific room'
  | 'specific home'
  | 'all homes'
  | 'upcoming home';

export type NotificationFormVariant = 'phone' | 'email';
export type NotificationStartTrigger = 'first_focus' | 'first_input';
export type NotificationFieldName = 'name' | 'phone' | 'email';
export type NotificationFieldCompletionMethod = 'blur' | 'valid_pattern' | 'value_present';
export type NotificationFailureStage = 'client_validation' | 'api_4xx' | 'api_5xx' | 'network';
export type NotificationErrorCode =
  | 'invalid_phone_length'
  | 'invalid_email'
  | 'missing_name'
  | 'server_error'
  | 'unknown';
export type NotificationCloseSource =
  | 'x_button'
  | 'go_back'
  | 'overlay'
  | 'esc'
  | 'auto_success_close';

export interface NotificationTrackingBasePayload {
  type: NotificationTrackingType;
  surface: NotificationSurface;
  notification_type: NotificationType;
  cta_id?: string;
  property_id?: string;
  property_name?: string;
  room_id?: string;
  journey_map_session_id?: string;
}

export function mapNotificationTrackingType(
  notificationType: NotificationType
): NotificationTrackingType {
  if (notificationType === 'upcoming home') return 'upcoming home';
  if (notificationType === 'all homes') return 'email newsletter';
  return 'specific property';
}

export function trackClickedGetNotifiied(
  payload: NotificationTrackingBasePayload
): void {
  trackWithContext(CLICKED_GET_NOTIFIIED_EVENT, payload);
}

export function trackNotificationFormStarted(
  payload: NotificationTrackingBasePayload & { start_trigger: NotificationStartTrigger }
): void {
  trackWithContext(NOTIFICATION_FORM_STARTED_EVENT, payload);
}

export function trackNotificationFormFieldCompleted(
  payload: NotificationTrackingBasePayload & {
    field_name: NotificationFieldName;
    completion_method: NotificationFieldCompletionMethod;
  }
): void {
  trackWithContext(NOTIFICATION_FORM_FIELD_COMPLETED_EVENT, payload);
}

export function trackNotificationFormSubmitAttempted(
  payload: NotificationTrackingBasePayload & {
    form_variant: NotificationFormVariant;
    validation_passed: boolean;
  }
): void {
  trackWithContext(NOTIFICATION_FORM_SUBMIT_ATTEMPTED_EVENT, payload);
}

export function trackNotificationFormSubmitSucceeded(
  payload: NotificationTrackingBasePayload & {
    form_variant: NotificationFormVariant;
    submit_latency_ms?: number;
  }
): void {
  trackWithContext(NOTIFICATION_FORM_SUBMIT_SUCCEEDED_EVENT, payload);
}

export function trackNotificationFormSubmitFailed(
  payload: NotificationTrackingBasePayload & {
    form_variant: NotificationFormVariant;
    failure_stage: NotificationFailureStage;
    error_code: NotificationErrorCode;
  }
): void {
  trackWithContext(NOTIFICATION_FORM_SUBMIT_FAILED_EVENT, payload);
}

export function trackNotificationModalClosed(
  payload: NotificationTrackingBasePayload & { close_source: NotificationCloseSource }
): void {
  trackWithContext(NOTIFICATION_MODAL_CLOSED_EVENT, payload);
}

// --- Upcoming map modal funnel tracking ---
export type UpcomingMapSurface = 'coming_soon_card';
export type UpcomingMapInteractionType =
  | 'marker_click'
  | 'drag'
  | 'zoom'
  | 'recenter'
  | 'map_loaded'
  | 'map_error';
export type UpcomingMapCtaType = 'get_launch_invite' | 'go_back';
export type UpcomingMapCloseSource =
  | 'go_back'
  | 'overlay'
  | 'esc'
  | 'x_button'
  | 'primary_cta';

export interface UpcomingMapTrackingBasePayload {
  surface: UpcomingMapSurface;
  map_session_id: string;
  property_id?: string;
  property_name: string;
  location_name: string;
  lat: number;
  lng: number;
}

export function trackUpcomingMapModalOpened(
  payload: UpcomingMapTrackingBasePayload & { source_cta_id?: string }
): void {
  trackWithContext(UPCOMING_MAP_MODAL_OPENED_EVENT, payload);
}

export function trackUpcomingMapInteraction(
  payload: UpcomingMapTrackingBasePayload & {
    interaction_type: UpcomingMapInteractionType;
    zoom_level?: number;
    marker_name?: string;
  }
): void {
  trackWithContext(UPCOMING_MAP_INTERACTION_EVENT, payload);
}

export function trackUpcomingMapCtaClicked(
  payload: UpcomingMapTrackingBasePayload & {
    cta_type: UpcomingMapCtaType;
    cta_id?: string;
  }
): void {
  trackWithContext(UPCOMING_MAP_CTA_CLICKED_EVENT, payload);
}

export function trackUpcomingMapModalClosed(
  payload: UpcomingMapTrackingBasePayload & {
    close_source: UpcomingMapCloseSource;
    time_in_modal_ms?: number;
    interaction_count?: number;
  }
): void {
  trackWithContext(UPCOMING_MAP_MODAL_CLOSED_EVENT, payload);
}

// --- Owners form funnel tracking ---
export type OwnersFormSurface = 'owners_contact_section';
export type OwnersStartTrigger = 'first_focus' | 'first_input';
export type OwnersFieldName =
  | 'firstname'
  | 'phone'
  | 'email'
  | 'landlord_lead_property_address'
  | 'typeofhome'
  | 'expected_rent'
  | 'is_property_vacant_now';
export type OwnersFailureStage = 'client_validation' | 'hubspot_api' | 'network';
export type OwnersErrorCode =
  | 'missing_typeofhome'
  | 'missing_expected_rent'
  | 'missing_vacancy_status'
  | 'missing_property_address'
  | 'hubspot_error'
  | 'unknown';

export interface OwnersFormBasePayload {
  form_id: 'owners_get_started_v1';
  surface: OwnersFormSurface;
}

export function trackOwnersFormViewed(payload: OwnersFormBasePayload): void {
  trackWithContext(OWNERS_FORM_VIEWED_EVENT, payload);
}

export function trackOwnersFormStarted(
  payload: OwnersFormBasePayload & { start_trigger: OwnersStartTrigger }
): void {
  trackWithContext(OWNERS_FORM_STARTED_EVENT, payload);
}

export function trackOwnersFormFieldCompleted(
  payload: OwnersFormBasePayload & { field_name: OwnersFieldName }
): void {
  trackWithContext(OWNERS_FORM_FIELD_COMPLETED_EVENT, payload);
}

export function trackOwnersFormSubmitAttempted(
  payload: OwnersFormBasePayload & {
    required_fields_present: boolean;
    has_property_address: boolean;
    has_expected_rent?: boolean;
  }
): void {
  trackWithContext(OWNERS_FORM_SUBMIT_ATTEMPTED_EVENT, payload);
}

export function trackOwnersFormSubmitSucceeded(
  payload: OwnersFormBasePayload & { submit_latency_ms?: number }
): void {
  trackWithContext(OWNERS_FORM_SUBMIT_SUCCEEDED_EVENT, payload);
}

export function trackOwnersFormSubmitFailed(
  payload: OwnersFormBasePayload & {
    failure_stage: OwnersFailureStage;
    error_code: OwnersErrorCode;
  }
): void {
  trackWithContext(OWNERS_FORM_SUBMIT_FAILED_EVENT, payload);
}

export interface PropertyCardClickPayload extends BasePropertyAnalyticsPayload {
  page_section?: string;
  cta_id?: string;
}

/**
 * Track when a user clicks a property card (listing). Use property_type to filter
 * discounted vs standard properties in PostHog.
 */
export function trackPropertyCardClick(payload: PropertyCardClickPayload): void {
  trackWithContext(PROPERTY_CARD_CLICKED_EVENT, {
    property_slug: payload.property_slug,
    property_type: payload.property_type,
    property_area: payload.property_area ?? null,
    page_section: payload.page_section,
    cta_id: payload.cta_id,
  });
}

export type PropertyPageViewPayload = BasePropertyAnalyticsPayload;

/**
 * Track when a user views a property detail page. Use property_type to filter
 * discounted vs standard in PostHog.
 */
export function trackPropertyPageView(payload: PropertyPageViewPayload): void {
  trackWithContext(PROPERTY_PAGE_VIEWED_EVENT, {
    property_slug: payload.property_slug,
    property_type: payload.property_type,
    property_area: payload.property_area ?? null,
  });
}

export type LockInSource = 'room' | 'full_house';

export interface HomesRentCalculatorOpenedPayload extends BasePropertyAnalyticsPayload {
  property_name: string;
  source: LockInSource;
  room_id?: string;
  room_name?: string;
  initial_lock_in_months: number;
  rent_total_after_discounts: number | null;
  open_cta_id?: string;
}

export function trackHomesRentCalculatorOpened(
  payload: HomesRentCalculatorOpenedPayload
): void {
  trackWithContext(HOMES_RENT_CALCULATOR_OPENED_EVENT, {
    property_slug: payload.property_slug,
    property_name: payload.property_name,
    property_type: payload.property_type,
    property_area: payload.property_area ?? null,
    source: payload.source,
    room_id: payload.room_id ?? null,
    room_name: payload.room_name ?? null,
    initial_lock_in_months: payload.initial_lock_in_months,
    rent_total_after_discounts: payload.rent_total_after_discounts,
    open_cta_id: payload.open_cta_id,
  });
}

export interface HomesRentLockInChangedPayload extends BasePropertyAnalyticsPayload {
  property_name: string;
  source: LockInSource;
  room_id?: string;
  room_name?: string;
  lock_in_months: number;
  rent_base: number | null;
  rent_maintenance: number | null;
  rent_furnishing: number | null;
  rent_convenience: number | null;
  rent_gst: number | null;
  rent_lock_in_discount: number;
  rent_promo_discount: number;
  rent_total_after_discounts: number | null;
}

export function trackHomesRentLockInChanged(
  payload: HomesRentLockInChangedPayload
): void {
  trackWithContext(HOMES_RENT_LOCK_IN_CHANGED_EVENT, {
    property_slug: payload.property_slug,
    property_name: payload.property_name,
    property_type: payload.property_type,
    property_area: payload.property_area ?? null,
    source: payload.source,
    room_id: payload.room_id ?? null,
    room_name: payload.room_name ?? null,
    lock_in_months: payload.lock_in_months,
    rent_base: payload.rent_base,
    rent_maintenance: payload.rent_maintenance,
    rent_furnishing: payload.rent_furnishing,
    rent_convenience: payload.rent_convenience,
    rent_gst: payload.rent_gst,
    rent_lock_in_discount: payload.rent_lock_in_discount,
    rent_promo_discount: payload.rent_promo_discount,
    rent_total_after_discounts: payload.rent_total_after_discounts,
  });
}

// --- Rent calculator tracking ---
export type RentCalculatorMode = 'roommate' | '1bhk';
export type RentCalculatorFurnitureMode = 'rent' | 'buy';
export type RentCalculatorInputName =
  | 'flent_rent'
  | 'traditional_rent'
  | 'traditional_maintenance'
  | 'traditional_deposit'
  | 'traditional_brokerage'
  | 'traditional_painting';

export interface RentCalculatorViewedPayload {
  surface: 'rent_calculator_page';
  default_mode: RentCalculatorMode;
  default_area: string;
  default_furniture_mode: RentCalculatorFurnitureMode;
}

export function trackRentCalculatorViewed(payload: RentCalculatorViewedPayload): void {
  trackWithContext(RENT_CALCULATOR_VIEWED_EVENT, payload);
}

export interface RentCalculatorAreaSelectedPayload {
  area_selected: string;
  previous_area: string;
  mode: RentCalculatorMode;
  interaction_source: 'area_chip';
}

export function trackRentCalculatorAreaSelected(
  payload: RentCalculatorAreaSelectedPayload
): void {
  trackWithContext(RENT_CALCULATOR_AREA_SELECTED_EVENT, payload);
}

export interface RentCalculatorModeChangedPayload {
  mode_selected: RentCalculatorMode;
  previous_mode: RentCalculatorMode;
}

export function trackRentCalculatorModeChanged(
  payload: RentCalculatorModeChangedPayload
): void {
  trackWithContext(RENT_CALCULATOR_MODE_CHANGED_EVENT, payload);
}

export interface RentCalculatorFurnitureModeChangedPayload {
  furniture_mode_selected: RentCalculatorFurnitureMode;
  previous_furniture_mode: RentCalculatorFurnitureMode;
  mode: RentCalculatorMode;
  area: string;
}

export function trackRentCalculatorFurnitureModeChanged(
  payload: RentCalculatorFurnitureModeChangedPayload
): void {
  trackWithContext(RENT_CALCULATOR_FURNITURE_MODE_CHANGED_EVENT, payload);
}

export interface RentCalculatorInputEditedPayload {
  input_name: RentCalculatorInputName;
  new_value: number;
  previous_value: number;
  mode: RentCalculatorMode;
  area: string;
  furniture_mode: RentCalculatorFurnitureMode;
  edit_method: 'typed';
}

export function trackRentCalculatorInputEdited(
  payload: RentCalculatorInputEditedPayload
): void {
  trackWithContext(RENT_CALCULATOR_INPUT_EDITED_EVENT, payload);
}

export interface RentCalculatorStateUpdatedPayload {
  mode: RentCalculatorMode;
  area: string;
  furniture_mode: RentCalculatorFurnitureMode;
  flent_rent: number;
  effective_traditional_rent: number;
  effective_traditional_maintenance: number;
  effective_traditional_deposit: number;
  effective_traditional_brokerage: number;
  traditional_painting: number;
  flent_total: number;
  traditional_total: number;
  savings: number;
  flent_wins: boolean;
}

export function trackRentCalculatorStateUpdated(
  payload: RentCalculatorStateUpdatedPayload
): void {
  trackWithContext(RENT_CALCULATOR_STATE_UPDATED_EVENT, payload);
}

// --- WhatsApp CTA tracking ---

export type WhatsAppCtaSource =
  | 'floating'
  | 'rent_calculator'
  | 'property_page'
  | 'owners_page'
  | 'bottom_nav'
  | 'lightbox'
  | 'how_it_works'
  | 'other';

export interface WhatsAppCtaClickedPayload {
  source: WhatsAppCtaSource;
  page_location?: string;
  property_slug?: string;
  property_name?: string;
  property_area?: string;
  cta_id?: string;
}

export function trackWhatsAppCtaClicked(
  payload: WhatsAppCtaClickedPayload
): void {
  trackWithContext(WHATSAPP_CTA_CLICKED_EVENT, {
    source: payload.source,
    page_location: payload.page_location,
    property_slug: payload.property_slug,
    property_name: payload.property_name,
    property_area: payload.property_area,
    cta_id: payload.cta_id,
  });
}

// --- Home tour tracking ---

export type HomeTourSource =
  | 'room_card'
  | 'full_house_card'
  | 'rent_calculator'
  | 'amenities_banner'
  | 'other';

export interface HomeTourClickedPayload {
  source: HomeTourSource;
  property_slug: string;
  property_name: string;
  property_area?: string;
  property_type: PropertyTypeFilter;
  room_id?: string;
  room_name?: string;
  lock_in_months?: number;
  rent_total_after_discounts?: number | null;
  cta_id?: string;
}

export function trackHomeTourClicked(
  payload: HomeTourClickedPayload
): void {
  trackWithContext(HOME_TOUR_CLICKED_EVENT, {
    source: payload.source,
    property_slug: payload.property_slug,
    property_name: payload.property_name,
    property_area: payload.property_area,
    property_type: payload.property_type,
    room_id: payload.room_id,
    room_name: payload.room_name,
    lock_in_months: payload.lock_in_months,
    rent_total_after_discounts: payload.rent_total_after_discounts,
    cta_id: payload.cta_id,
  });
}

// --- FAQ click tracking ---

export type FaqLocation =
  | 'property_page'
  | 'owners_page'
  | 'homepage'
  | 'other';

export interface FaqClickedPayload {
  faq_id: number;
  faq_question: string;
  faq_category: string;
  location: FaqLocation;
  property_slug?: string;
}

export function trackFaqClicked(
  payload: FaqClickedPayload
): void {
  trackWithContext(FAQ_CLICKED_EVENT, {
    faq_id: payload.faq_id,
    faq_question: payload.faq_question,
    faq_category: payload.faq_category,
    location: payload.location,
    property_slug: payload.property_slug,
  });
}

/**
 * Extract text content from a React element or DOM node
 */
export function extractTextContent(element: React.ReactNode | HTMLElement | null): string {
  if (!element) return '';

  // Handle React nodes
  if (typeof element === 'string') return element;
  if (typeof element === 'number') return String(element);

  // Handle DOM elements
  if (element instanceof HTMLElement) {
    return element.textContent?.trim() || element.innerText?.trim() || '';
  }

  // Handle React elements (basic extraction)
  if (typeof element === 'object' && 'props' in element) {
    const props = (element as any).props;
    if (props.children) {
      if (typeof props.children === 'string') {
        return props.children;
      }
      if (Array.isArray(props.children)) {
        return props.children
          .map((child: any) => extractTextContent(child))
          .join(' ')
          .trim();
      }
    }
  }

  return '';
}

/**
 * Generate a unique CTA ID from element attributes or content
 */
export function generateCTAId(
  element: HTMLElement | null,
  fallbackText?: string
): string {
  if (!element) {
    return fallbackText ? `cta_${fallbackText.toLowerCase().replace(/\s+/g, '_')}` : 'cta_unknown';
  }

  // Check for data-cta-id attribute (highest priority)
  const dataCtaId = element.getAttribute('data-cta-id');
  if (dataCtaId) return dataCtaId;

  // Check for id attribute
  const id = element.id;
  if (id) return id;

  // Check for name attribute
  const name = element.getAttribute('name');
  if (name) return name;

  // Generate from text content
  const text = element.textContent?.trim() || element.innerText?.trim() || fallbackText || '';
  if (text) {
    return `cta_${text.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 50)}`;
  }

  // Fallback to element type and position
  const tagName = element.tagName.toLowerCase();
  const index = Array.from(element.parentElement?.children || []).indexOf(element);
  return `cta_${tagName}_${index}`;
}


