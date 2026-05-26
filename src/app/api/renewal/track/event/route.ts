import { NextRequest, NextResponse } from "next/server";
import { getTenantByToken, logEvent, type EventType } from "@/lib/renewal/db";
import { fireRenewalEvent, type RenewalEvent } from "@/lib/renewal/hubspot";

// Map UI tracking calls → canonical event types in Supabase + HubSpot mirror.
const ALLOWED: Record<string, { db: EventType; hs?: RenewalEvent }> = {
  page_viewed:                { db: "page_viewed",              hs: "renewal_page_viewed" },
  tier_clicked:               { db: "tier_clicked",             hs: "renewal_tier_picked" },
  cta_callback_clicked:       { db: "cta_callback_clicked" },
  cta_whatsapp_clicked:       { db: "cta_whatsapp_clicked" },
  cta_pick_renewal_clicked:   { db: "cta_pick_renewal_clicked" },
};

export async function POST(req: NextRequest) {
  let body: { token?: string; type?: string; meta?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const { token, type, meta } = body;
  if (!token || !type || !(type in ALLOWED)) {
    return NextResponse.json({ ok: false, error: "bad_input" }, { status: 400 });
  }
  const tenant = await getTenantByToken(token);
  if (!tenant) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const ua = req.headers.get("user-agent");
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip");
  const target = ALLOWED[type];
  await logEvent(tenant.id, target.db, meta ?? {}, ua, ip);
  if (target.hs) {
    fireRenewalEvent(target.hs, tenant.email, {
      pid: tenant.pid ?? undefined,
      rid: tenant.rid ?? undefined,
      ...flatten(meta),
    });
  }
  return NextResponse.json({ ok: true });
}

function flatten(meta: Record<string, unknown> | undefined): Record<string, string | number | boolean> {
  if (!meta) return {};
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") out[k] = v;
    else out[k] = JSON.stringify(v);
  }
  return out;
}
