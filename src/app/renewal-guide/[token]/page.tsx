import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getTenantByToken, logEvent } from "@/lib/renewal/db";
import { quoteAll, type TierKey, VALID_TIERS } from "@/lib/renewal/pricing";
import { computeDeadlineInfo } from "@/lib/renewal/dates";
import { fireRenewalEvent } from "@/lib/renewal/hubspot";
import TokenRenewalClient from "./TokenRenewalClient";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ tier?: string }>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const tenant = await getTenantByToken(token);
  if (!tenant) notFound();

  const h = await headers();
  const ua = h.get("user-agent");
  const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? null;

  // Log + mirror to HubSpot. Both are fire-and-forget at the boundary so
  // the page still renders fast if either layer is slow.
  await logEvent(tenant.id, "page_viewed", { token, initialTier: sp.tier ?? null }, ua, ip);
  fireRenewalEvent("renewal_page_viewed", tenant.email, {
    pid: tenant.pid ?? undefined,
    rid: tenant.rid ?? undefined,
    initial_tier: sp.tier ?? undefined,
  });

  const quotes = quoteAll(tenant.current_rent, tenant.escalation_pct);
  const initialTier =
    sp.tier && VALID_TIERS.includes(sp.tier as TierKey) ? (sp.tier as TierKey) : null;
  const deadline = computeDeadlineInfo(tenant.move_out_date);

  return (
    <TokenRenewalClient
      token={token}
      tenant={{
        name: tenant.name,
        email: tenant.email,
        property: tenant.property,
        currentRent: tenant.current_rent,
        escalationPct: tenant.escalation_pct,
      }}
      quotes={quotes}
      initialTier={initialTier}
      deadlineIso={deadline.deadline.toISOString()}
      effectiveFromIso={deadline.effectiveFrom.toISOString()}
      isPastDue={deadline.isPastDue}
      calLink={process.env.RENEWAL_CAL_LINK ?? "https://cal.com/flent/renewal-help"}
      waLink={process.env.RENEWAL_WA_LINK ?? "https://wa.me/918618906754"}
    />
  );
}
