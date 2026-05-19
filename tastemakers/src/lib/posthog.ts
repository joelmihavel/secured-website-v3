import posthog from 'posthog-js'

const APPLICATION_SUBMIT_ATTEMPTED = 'tastemaker_application_submit_attempted'
const APPLICATION_SUBMIT_SUCCEEDED = 'tastemaker_application_submit_succeeded'
const APPLICATION_SUBMIT_FAILED = 'tastemaker_application_submit_failed'

export function isPostHogAvailable(): boolean {
  if (typeof window === 'undefined') return false
  return posthog.__loaded === true
}

function getPageContext(): Record<string, string | number | undefined> {
  if (typeof window === 'undefined') return {}
  return {
    $current_url: window.location.href,
    page_path: window.location.pathname,
    page_hash: window.location.hash || undefined,
    referrer: document.referrer || undefined,
  }
}

function getSessionContext(): Record<string, string | undefined> {
  if (!isPostHogAvailable()) return {}
  try {
    return {
      session_id: posthog.get_session_id?.() || undefined,
      distinct_id: posthog.get_distinct_id?.() || undefined,
    }
  } catch {
    return {}
  }
}

export function initPostHog(): void {
  if (typeof window === 'undefined') return

  const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
  if (!key) {
    if (import.meta.env.DEV) {
      console.warn('[posthog] VITE_PUBLIC_POSTHOG_KEY is not set — analytics disabled.')
    }
    return
  }

  if (posthog.__loaded) return

  posthog.init(key, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://ph.flent.in',
    ui_host: 'https://us.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
  })
}

export function capturePageView(): void {
  if (!isPostHogAvailable()) return
  const url = window.location.href
  posthog.capture('$pageview', { $current_url: url })
}

export type CTAClickPayload = {
  cta_id: string
  cta_text: string
  cta_type: 'button' | 'link' | 'form_submit'
  cta_destination?: string
  page_section?: string
}

export function trackCTAClick(payload: CTAClickPayload): void {
  if (!isPostHogAvailable()) {
    if (import.meta.env.DEV) {
      console.warn('[posthog] CTA click not tracked:', payload.cta_id)
    }
    return
  }

  posthog.capture('cta_clicked', {
    ...payload,
    ...getPageContext(),
    ...getSessionContext(),
    timestamp: new Date().toISOString(),
  })
}

export function trackTastemakerApplicationSubmitAttempted(): void {
  trackApplicationEvent(APPLICATION_SUBMIT_ATTEMPTED)
}

export function trackTastemakerApplicationSubmitSucceeded(payload?: {
  submit_latency_ms?: number
}): void {
  trackApplicationEvent(APPLICATION_SUBMIT_SUCCEEDED, payload)
}

export function trackTastemakerApplicationSubmitFailed(payload: {
  error_message: string
}): void {
  trackApplicationEvent(APPLICATION_SUBMIT_FAILED, payload)
}

function trackApplicationEvent(
  eventName: string,
  extra?: Record<string, string | number | undefined>,
): void {
  if (!isPostHogAvailable()) {
    if (import.meta.env.DEV) {
      console.warn(`[posthog] Event not tracked: ${eventName}`)
    }
    return
  }

  posthog.capture(eventName, {
    form_id: 'tastemaker_application_v1',
    ...getPageContext(),
    ...getSessionContext(),
    timestamp: new Date().toISOString(),
    ...extra,
  })
}

/** Fire-and-forget handler for anchor / button CTAs. */
export function onTrackedCtaClick(payload: CTAClickPayload): () => void {
  return () => trackCTAClick(payload)
}
