/**
 * PostHog Provider
 *
 * Initializes PostHog analytics with autocapture exclusion for tracked CTAs.
 * Configures attribution tracking for Meta Ads (fbclid) and Google Ads (gclid).
 *
 * PostHog client + react bindings are loaded lazily during browser idle time
 * to keep them out of the critical-path bundle and reduce TBT.
 */
'use client'
import { useEffect, Suspense, useState } from 'react'
import { usePathname, useSearchParams } from "next/navigation"
import { CTATracker } from "@/components/tracking/CTATracker"

// Minimal structural type — posthog-js's `PostHog` declaration triggers a
// class/namespace resolution issue when imported as a type, so we describe
// just the methods we use and cast at the Provider boundary.
type PostHogClient = {
  capture: (event: string, properties?: Record<string, unknown>) => unknown;
  init: (apiKey: string, config?: Record<string, unknown>) => unknown;
};

type CaptureResultLike = {
  event?: string;
  properties?: {
    $elements?: Array<{
      attributes?: Record<string, unknown>;
      attr_class?: string;
    }>;
  };
}

function PostHogPageView({ client }: { client: PostHogClient | null }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!client || !pathname) return;
    let url = window.origin + pathname
    if (searchParams.toString()) {
      url = url + `?${searchParams.toString()}`
    }
    client.capture('$pageview', {
      '$current_url': url,
    })
  }, [pathname, searchParams, client])

  return null
}

type ProviderComponent = React.ComponentType<{ client: unknown; children: React.ReactNode }>;

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<PostHogClient | null>(null);
  const [Provider, setProvider] = useState<ProviderComponent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    let cancelled = false;

    const init = async () => {
      const [{ default: posthog }, { PostHogProvider }] = await Promise.all([
        import('posthog-js'),
        import('posthog-js/react'),
      ]);
      if (cancelled) return;

      const initConfig = {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://ph.flent.in',
        ui_host: 'https://us.posthog.com',
        person_profiles: 'identified_only' as const,
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: {
          css_selector_allowlist: undefined,
          dom_event_allowlist: undefined,
          element_allowlist: undefined,
        },
        before_send: (cr: CaptureResultLike | null) => {
          if (!cr) return null;
          if (cr.event === '$autocapture') {
            const elements = cr.properties?.$elements;
            if (Array.isArray(elements) && elements.length > 0) {
              const targetEl = elements[0];
              if (
                targetEl?.attributes?.['ph-no-capture'] !== undefined ||
                targetEl?.attr_class?.includes('ph-no-capture')
              ) {
                return null;
              }
            }
          }
          return cr;
        },
      };

      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, initConfig);
      setClient(posthog as unknown as PostHogClient);
      setProvider(() => PostHogProvider as unknown as ProviderComponent);
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };

    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(() => init(), { timeout: 3000 });
    } else {
      setTimeout(init, 1500);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  if (!Provider || !client) {
    return (
      <>
        <CTATracker />
        {children}
      </>
    );
  }

  return (
    <Provider client={client}>
      <Suspense fallback={null}>
        <PostHogPageView client={client} />
      </Suspense>
      <CTATracker />
      {children}
    </Provider>
  )
}
