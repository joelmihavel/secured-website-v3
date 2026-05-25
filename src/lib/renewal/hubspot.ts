// HubSpot timeline events for the renewal flow.
//
// Uses the same `pe45469632_*` event-name convention as the existing
// notification events in src/lib/hubspot-server.ts. Each event attaches to
// the contact matched by tenant email.
//
// Events fire fire-and-forget: any failure is logged but never blocks the
// tenant-facing response. The Supabase events table remains the durable
// source of truth.

import { Client } from "@hubspot/api-client";

const HUBSPOT_ACCOUNT_PREFIX = "pe45469632_";

export type RenewalEvent =
  | "renewal_email_opened"
  | "renewal_link_clicked"
  | "renewal_page_viewed"
  | "renewal_tier_picked"
  | "renewal_confirmed";

type ContactCache = Map<string, string | null>;
const _contactCache: ContactCache = new Map();

let _client: Client | null = null;
function client(): Client {
  if (_client) return _client;
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    throw new Error("HUBSPOT_ACCESS_TOKEN is not set.");
  }
  _client = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
  return _client;
}

async function findContactByEmail(email: string): Promise<string | null> {
  const key = email.trim().toLowerCase();
  if (_contactCache.has(key)) return _contactCache.get(key) ?? null;
  try {
    const res = await client().crm.contacts.searchApi.doSearch({
      filterGroups: [
        { filters: [{ propertyName: "email", operator: "EQ" as never, value: key }] },
      ],
      sorts: ["createdate"],
      properties: ["email"],
      limit: 1,
    });
    const id = res.results[0]?.id ?? null;
    _contactCache.set(key, id);
    return id;
  } catch (e) {
    console.error("[hubspot-renewal] contact search failed", e);
    return null;
  }
}

export async function fireRenewalEvent(
  event: RenewalEvent,
  email: string,
  properties: Record<string, string | number | boolean | null | undefined> = {},
): Promise<void> {
  if (!process.env.HUBSPOT_ACCESS_TOKEN) return; // soft skip if not configured
  try {
    const contactId = await findContactByEmail(email);
    if (!contactId) {
      console.warn(`[hubspot-renewal] no contact for ${email}, skipping ${event}`);
      return;
    }
    const cleanProps: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(properties)) {
      if (v === null || v === undefined) continue;
      cleanProps[k] = typeof v === "boolean" ? String(v) : v;
    }
    const res = await fetch("https://api.hubapi.com/events/v3/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        eventName: HUBSPOT_ACCOUNT_PREFIX + event,
        objectId: contactId,
        occurredAt: new Date().toISOString(),
        properties: cleanProps,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[hubspot-renewal] ${event} failed: ${res.status} ${text}`);
    }
  } catch (e) {
    console.error(`[hubspot-renewal] ${event} threw`, e);
  }
}
