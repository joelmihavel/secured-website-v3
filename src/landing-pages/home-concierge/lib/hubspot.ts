export const areaOptions = [
  { label: "HSR Layout", value: "HSR Layout" },
  { label: "Koramangala", value: "Koramangala" },
  { label: "Indiranagar", value: "Indiranagar" },
  { label: "Bellandur – Sarjapura", value: "Bellandur - Sarjapura" },
  { label: "Whitefield", value: "Whitefield" },
  { label: "Ulsoor – MG Road", value: "Ulsoor - MG Road" },
  { label: "Open to suggestions", value: "Open to Suggestions" },
]

export const budgetRoomOptions = [
  "₹20,000 – ₹25,000 / mo",
  "₹25,000 – ₹30,000 / mo",
  "₹30,000 – ₹35,000 / mo",
  "₹35,000 – ₹40,000 / mo",
  "₹40,000 – ₹45,000 / mo",
  "₹45,000+ / mo",
]

export const budgetFullHomeOptions = [
  "₹55,000 – ₹70,000 / mo",
  "₹70,000 – ₹1,00,000 / mo",
  "₹1,00,000 – ₹1,50,000 / mo",
  "₹1,50,000+ / mo",
]

export const timelineOptions = [
  "Within 2 weeks",
  "Within a month",
  "1–3 months",
  "Just exploring",
]

// ---------------------------------------------------------------------------
// UTM Attribution
// ---------------------------------------------------------------------------

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

type UTMKey = (typeof UTM_KEYS)[number]
type UTMMap = Partial<Record<UTMKey, string>>

const SESSION_KEY = "flent_utms"

/**
 * Call once on page mount. Reads UTM params from the URL and persists them
 * in sessionStorage so they survive soft navigations and form steps.
 * Only overwrites existing values when new UTM params are present.
 */
export function captureUTMs(): void {
  if (typeof window === "undefined") return
  const params = new URLSearchParams(window.location.search)
  const incoming: UTMMap = {}
  for (const key of UTM_KEYS) {
    const val = params.get(key)
    if (val) incoming[key] = val
  }
  if (Object.keys(incoming).length === 0) return
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(incoming))
}

function readUTMs(): UTMMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as UTMMap) : {}
  } catch {
    return {}
  }
}

/** Reads the HubSpot visitor token cookie — links the contact to browsing history. */
function readHutk(): string | undefined {
  if (typeof document === "undefined") return undefined
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/)
  return match ? match[1] : undefined
}

// ---------------------------------------------------------------------------
// HubSpot Forms API
// ---------------------------------------------------------------------------

const PORTAL_ID = "45469632"
const FORM_ID = "5413c5b2-25f5-4891-979d-b147207abee0"
const SUBMIT_URL = `https://api-na2.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`

/**
 * Part 1 — PII capture.
 * Submits immediately so the lead is recorded even if the user drops off.
 * UTM params and the hutk cookie are attached here (first touch attribution).
 */
export async function submitLeadPart1(name: string, email: string, phone: string) {
  const utms = readUTMs()
  const hutk = readHutk()

  const utmFields = UTM_KEYS
    .filter((k) => !!utms[k])
    .map((k) => ({ name: k, value: utms[k] as string }))

  await fetch(SUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: [
        { name: "firstname", value: name },
        { name: "email", value: email },
        { name: "phone", value: phone },
        ...utmFields,
      ],
      context: {
        hutk,
        pageUri: typeof window !== "undefined" ? window.location.href : "",
        pageName: "Flent Landing Page",
      },
    }),
  })
}

/**
 * Part 2 — Qualifying data.
 * Updates the same contact (matched by email) with home preferences.
 */
export async function submitLeadPart2(
  email: string,
  homeType: "room" | "fullhome",
  bhk: string | null,
  area: string,
  budget: string,
  timeline: string,
) {
  const typeofhome = homeType === "room" ? "Private Room" : (bhk ?? "Full Home")
  const roomFlag = homeType === "room" ? "TRUE" : "FALSE"

  await fetch(SUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: [
        { name: "email", value: email },
        { name: "typeofhome", value: typeofhome },
        { name: "room_flag", value: roomFlag },
        { name: "preferred_area", value: area },
        { name: "budget_range", value: budget },
        { name: "lead_move_in_timeline", value: timeline },
      ],
      context: {
        pageUri: typeof window !== "undefined" ? window.location.href : "",
        pageName: "Flent Landing Page",
      },
    }),
  })
}
