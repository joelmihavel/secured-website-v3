import { NextRequest, NextResponse } from "next/server";
import { getTenantByToken, logEvent, upsertRenewal } from "@/lib/renewal/db";
import { quoteFor, VALID_TIERS, type TierKey } from "@/lib/renewal/pricing";
import { fireRenewalEvent } from "@/lib/renewal/hubspot";

export async function POST(req: NextRequest) {
  let body: { token?: string; tier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const { token, tier } = body;
  if (!token || !tier || !VALID_TIERS.includes(tier as TierKey)) {
    return NextResponse.json({ ok: false, error: "bad_input" }, { status: 400 });
  }
  const tenant = await getTenantByToken(token);
  if (!tenant) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  // Recompute the quote server-side from canonical pricing — never trust the client.
  const q = quoteFor(tenant.current_rent, tenant.escalation_pct, tier as TierKey);

  await upsertRenewal(tenant.id, q.key, q.newRent, q.monthlySavings);

  const ua = req.headers.get("user-agent");
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip");
  await logEvent(
    tenant.id,
    "renewal_confirmed",
    { tier: q.key, newRent: q.newRent, monthlySavings: q.monthlySavings, termSavings: q.termSavings },
    ua,
    ip,
  );

  // HubSpot timeline mirror — fire-and-forget, doesn't block the response.
  fireRenewalEvent("renewal_confirmed", tenant.email, {
    pid: tenant.pid ?? undefined,
    rid: tenant.rid ?? undefined,
    tier: q.key,
    new_rent: q.newRent,
    monthly_savings: q.monthlySavings,
    term_savings: q.termSavings,
  });

  return NextResponse.json({ ok: true, newRent: q.newRent, monthlySavings: q.monthlySavings });
}
