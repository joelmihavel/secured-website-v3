import { NextRequest, NextResponse } from "next/server";
import { getTenantByToken, logEvent, type EventType } from "@/lib/renewal/db";
import { fireRenewalEvent } from "@/lib/renewal/hubspot";

// Click-tracking redirector. Every renewal email link routes here first so we
// log the click + mirror to HubSpot, then 302 the tenant on to the destination.

export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get("t");
  const d = req.nextUrl.searchParams.get("d");
  const label = req.nextUrl.searchParams.get("l") ?? "unknown";

  if (t && d) {
    const tenant = await getTenantByToken(t);
    if (tenant) {
      const ua = req.headers.get("user-agent");
      const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip");
      const type = mapLabel(label);
      await logEvent(tenant.id, type, { label, dest: d }, ua, ip);
      fireRenewalEvent("renewal_link_clicked", tenant.email, {
        pid: tenant.pid ?? undefined,
        rid: tenant.rid ?? undefined,
        label,
      });
    }
  }

  const dest = safeUrl(d) ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://flent.in"}/`;
  return NextResponse.redirect(dest, { status: 302 });
}

function mapLabel(label: string): EventType {
  if (label === "pick_renewal_cta") return "cta_pick_renewal_clicked";
  if (label === "callback_cta") return "cta_callback_clicked";
  if (label === "whatsapp_cta") return "cta_whatsapp_clicked";
  return "email_link_clicked";
}

function safeUrl(d: string | null): string | null {
  if (!d) return null;
  try {
    const u = new URL(d);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {}
  return null;
}
