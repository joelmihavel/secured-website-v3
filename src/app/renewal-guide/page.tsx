"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import RenewalLanding, { type ConfirmResult } from "@/components/renewal/RenewalLanding";
import { quoteAll, type TierKey, VALID_TIERS } from "@/lib/renewal/pricing";
import { computeDeadlineInfo } from "@/lib/renewal/dates";

const DEMAND_MWEB_ORIGIN = process.env.NEXT_PUBLIC_DEMAND_MWEB_ORIGIN ?? "";
const RENEWAL_ENDPOINT = `${DEMAND_MWEB_ORIGIN}/api/public/renewal-selection`;

// demand-mweb expects "no_lock_in" / "6m" / "9m" / "11m" — keep that wire shape.
const TIER_TO_DEMAND_MWEB: Record<TierKey, string> = {
  no_lockin: "no_lock_in",
  "6_months": "6m",
  "9_months": "9m",
  "11_months": "11m",
};

const ERROR_MESSAGES: Record<number, string> = {
  400: "Something's off with this link — please use the link from your latest email.",
  401: "This link has expired or wasn't meant for you. Please use the most recent email we sent.",
  404: "This link has expired or wasn't meant for you. Please use the most recent email we sent.",
  409: "This renewal is already closed. Reply to the email if you need to change anything.",
  500: "Something broke on our end. Reply to the email and we'll handle it.",
};

export default function RenewalGuidePage() {
  // Hydrate URL params after mount (avoid SSR hydration mismatch).
  const [ready, setReady] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [currentRent, setCurrentRent] = useState(50000);
  const [escalation, setEscalation] = useState(0.10);
  const [moveOutDate, setMoveOutDate] = useState<string | null>(null);
  const [initialTier, setInitialTier] = useState<TierKey | null>(null);
  const [cycle, setCycle] = useState<string | null>(null);
  const [sig, setSig] = useState<string | null>(null);
  const [brokenLink, setBrokenLink] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") ?? "";
    const name = params.get("name") ?? "";
    const rentParam = params.get("current_rent") ?? params.get("rent");
    const rentParsed = rentParam ? parseInt(rentParam.replace(/[₹,\s]/g, ""), 10) : NaN;
    const rent = Number.isFinite(rentParsed) ? rentParsed : 50000;
    const escRaw = params.get("escalation");
    // Accept either "10" (percent) or "0.10" (fraction). Both happen in the wild.
    let esc = 0.10;
    if (escRaw) {
      const n = parseFloat(escRaw);
      if (Number.isFinite(n)) esc = n > 1 ? n / 100 : n;
    }
    const move = params.get("move_out") ?? params.get("move_out_date");
    const tierParam = params.get("tier") ?? params.get("selection");
    const cycleParam = params.get("cycle");
    const sigParam = params.get("sig");

    setTenantEmail(email);
    setTenantName(name);
    setCurrentRent(rent);
    setEscalation(esc);
    setMoveOutDate(move);
    setInitialTier(
      tierParam && VALID_TIERS.includes(tierParam as TierKey) ? (tierParam as TierKey) : null,
    );
    setCycle(cycleParam);
    setSig(sigParam);
    if (!cycleParam || !sigParam) setBrokenLink(true);
    setReady(true);
  }, []);

  const quotes = useMemo(() => quoteAll(currentRent, escalation), [currentRent, escalation]);
  const deadline = useMemo(() => computeDeadlineInfo(moveOutDate), [moveOutDate]);

  async function onConfirm(tier: TierKey): Promise<ConfirmResult> {
    if (brokenLink || !cycle || !sig) {
      return { ok: false, error: "This link seems broken — check your email for the latest renewal message." };
    }
    if (!tenantEmail) {
      return { ok: false, error: "Please use the link from your latest renewal email." };
    }
    try {
      const res = await fetch(RENEWAL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cycle,
          sig,
          email: tenantEmail,
          name: tenantName || undefined,
          selection: TIER_TO_DEMAND_MWEB[tier],
        }),
      });
      if (res.ok) return { ok: true };
      return { ok: false, error: ERROR_MESSAGES[res.status] ?? "Something went wrong. Please try again." };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  if (!ready) {
    return <div style={{ background: "#FCFBF7", minHeight: "100vh" }} />;
  }

  if (brokenLink) {
    return (
      <div className="min-h-screen" style={{ background: "#FCFBF7", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="rounded-3xl bg-white p-8" style={{ borderColor: "#EFEAE0", borderWidth: 1 }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#FEF2F2" }}>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#15102E" }}>Link looks broken</h2>
            <p className="text-sm" style={{ color: "#8C8C8C" }}>
              This link seems broken — check your email for the latest renewal message.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RenewalLanding
      tenant={{
        name: tenantName,
        email: tenantEmail,
        property: null, // demand-mweb signed link doesn't pass property name; fallback copy handles it.
        currentRent,
        escalationPct: escalation,
      }}
      quotes={quotes}
      initialTier={initialTier}
      deadlineIso={deadline.deadline.toISOString()}
      effectiveFromIso={deadline.effectiveFrom.toISOString()}
      isPastDue={deadline.isPastDue}
      calLink={process.env.NEXT_PUBLIC_RENEWAL_CAL_LINK ?? "https://cal.com/flent/renewal-help"}
      waLink={process.env.NEXT_PUBLIC_RENEWAL_WA_LINK ?? "https://wa.me/918618906754"}
      onConfirm={onConfirm}
    />
  );
}
