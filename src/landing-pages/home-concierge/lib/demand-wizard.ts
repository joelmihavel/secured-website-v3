const SESSION_KEY = "flent_utms"

function getUtmCampaign(): string | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return undefined
    const utms = JSON.parse(raw) as Record<string, string>
    return utms.utm_campaign || undefined
  } catch {
    return undefined
  }
}

export interface CallbackData {
  name: string
  phone: string
  email: string
  // Qualifier fields — Part 2 only. Omitted when firing from Part 1.
  homeType?: "room" | "fullhome"
  bhk?: string | null
  area?: string
  budget?: string
  timeline?: string
}

/**
 * Fires the Demand Wizard partner callback via our server-side API route.
 * Fire from Part 1 (PII captured) so leads who never finish Part 2 still
 * land in the rep queue. Fire again from Part 2 — the upstream dedupes by
 * phone within a 2-hour pending window, so the second call is a safe no-op.
 *
 * Fire-and-forget: do NOT await in the user flow's critical path.
 */
export async function sendCallback(data: CallbackData): Promise<void> {
  // The route lives under /home-concierge/api/callback — the bare /api/callback
  // path doesn't exist, so a wrong path here silently 404s (fetch resolves on
  // non-2xx) and the upstream never sees the lead.
  const res = await fetch("/home-concierge/api/callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      utmCampaign: getUtmCampaign(),
    }),
  })
  if (!res.ok) {
    console.error("[sendCallback] non-2xx from /home-concierge/api/callback", res.status)
  }
}
