"use client";

import RenewalLanding, { type RenewalLandingProps, type ConfirmResult } from "@/components/renewal/RenewalLanding";
import { type TierKey } from "@/lib/renewal/pricing";

type Props = Omit<RenewalLandingProps, "onConfirm" | "onTrack"> & {
  token: string;
};

export default function TokenRenewalClient(props: Props) {
  const { token, ...rest } = props;

  async function onConfirm(tier: TierKey): Promise<ConfirmResult> {
    try {
      const res = await fetch("/api/renewal/confirm-by-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, tier }),
      });
      if (res.ok) return { ok: true };
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body.error ?? "Something went wrong. Reply to the email and we'll handle it." };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  function onTrack(type: string, meta?: Record<string, unknown>) {
    fetch("/api/renewal/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, type, meta }),
      keepalive: true,
    }).catch(() => {});
  }

  return <RenewalLanding {...rest} onConfirm={onConfirm} onTrack={onTrack} />;
}
