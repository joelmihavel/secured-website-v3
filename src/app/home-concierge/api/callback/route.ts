import { type NextRequest, NextResponse } from "next/server"

const ENDPOINT = "https://demand-mweb.vercel.app/api/webhooks/callbacks"
const RETRY_DELAYS_MS = [1000, 3000, 10000] // 3 attempts on 5xx

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strips commas, extracts the first run of digits → INR integer */
function parseBudget(raw: string): number | undefined {
  const match = raw.replace(/,/g, "").match(/\d+/)
  return match ? parseInt(match[0], 10) : undefined
}

/** Normalise Indian phone numbers to E.164 (+91XXXXXXXXXX) */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (raw.trim().startsWith("+")) return "+" + digits
  if (digits.startsWith("91") && digits.length === 12) return "+" + digits
  if (digits.length === 10) return "+91" + digits
  return raw
}

/** Approximate YYYY-MM-DD from a timeline string */
function moveInDate(timeline: string): string | undefined {
  const add = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().split("T")[0]
  }
  if (timeline.includes("2 week")) return add(14)
  if (/within a month/i.test(timeline)) return add(30)
  if (/1.{1,3}3 month/i.test(timeline)) return add(75)
  return undefined // "Just exploring" → omit field
}

/** Build a human-readable requirement note from form data */
function requirementNote(
  homeType: "room" | "fullhome",
  bhk: string | null,
): string {
  if (homeType === "room") return "Private room"
  return bhk ? `Full home — ${bhk}` : "Full home"
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  idempotencyKey: string,
): Promise<Response> {
  let lastError: unknown
  for (let i = 0; i < RETRY_DELAYS_MS.length; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers as Record<string, string>),
          "X-Idempotency-Key": idempotencyKey,
        },
      })
      if (res.status < 500) return res // success or non-retryable client error
      if (i < RETRY_DELAYS_MS.length - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[i]))
      }
      lastError = new Error(`HTTP ${res.status}`)
    } catch (err) {
      lastError = err
      if (i < RETRY_DELAYS_MS.length - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[i]))
      }
    }
  }
  throw lastError
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const secret = process.env.DEMAND_WIZARD_SECRET
  if (!secret) {
    console.error("[callback] DEMAND_WIZARD_SECRET is not set")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  let body: {
    name: string
    phone: string
    email: string
    homeType: "room" | "fullhome"
    bhk: string | null
    area: string
    budget: string
    timeline: string
    utmCampaign?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { name, phone, email, homeType, bhk, area, budget, timeline, utmCampaign } = body

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 400 })
  }

  const idempotencyKey = crypto.randomUUID()
  const externalRef = utmCampaign
    ? `sem_lp_${utmCampaign}_${Date.now()}`
    : `sem_lp_${Date.now()}`

  const payload: Record<string, unknown> = {
    name,
    phone: normalisePhone(phone),
    source: "sem_form",
    external_ref: externalRef,
    submitted_at: new Date().toISOString(),
  }

  if (email) payload.email = email
  if (area) payload.location_preference = area
  if (budget) {
    const budgetNum = parseBudget(budget)
    if (budgetNum !== undefined) payload.budget = budgetNum
  }
  const date = moveInDate(timeline)
  if (date) payload.move_in_date = date
  payload.requirement_notes = requirementNote(homeType, bhk)

  try {
    const res = await fetchWithRetry(
      ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": secret,
        },
        body: JSON.stringify(payload),
      },
      idempotencyKey,
    )

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error("[callback] Demand Wizard error", res.status, data)
      return NextResponse.json({ error: "Upstream error" }, { status: 502 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("[callback] Failed after retries", err)
    return NextResponse.json({ error: "Upstream unreachable" }, { status: 502 })
  }
}
