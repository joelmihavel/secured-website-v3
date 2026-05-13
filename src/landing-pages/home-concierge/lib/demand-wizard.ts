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
  homeType: "room" | "fullhome"
  bhk: string | null
  area: string
  budget: string
  timeline: string
}

/**
 * Fires the Demand Wizard partner callback via our server-side API route.
 * Call this after Part 2 submission — do NOT await in the critical path,
 * the user flow should not be gated on the callback succeeding.
 */
export async function sendCallback(data: CallbackData): Promise<void> {
  await fetch("/api/callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      utmCampaign: getUtmCampaign(),
    }),
  })
}
