// ─── HubSpot helpers (inlined — Vercel only compiles API entry files to JS) ──

import { socialLinksToHubSpotProperties } from './social-links-hubspot'

type TastemakerApplicationPayload = {
  fullName: string
  email: string
  city: string
  socialLinks: string[]
  homeAnswer: string
}

const HUBSPOT_API = 'https://api.hubapi.com'

/** Customer Type (`customer_type`) single-select — internal option value in HubSpot. */
const CUSTOMER_TYPE_AFFILIATE_APPLICANT = 'Affiliate Applicant'

/** CRM internal name for the “what makes a house a home” application answer. */
const HUBSPOT_PROP_AFFILIATE_ANSWER = 'affiliate__answer'

function splitName(fullName: string): { firstname: string; lastname: string } {
  const trimmed = fullName.trim()
  if (!trimmed) return { firstname: '', lastname: '' }
  const parts = trimmed.split(/\s+/)
  return { firstname: parts[0] ?? '', lastname: parts.length > 1 ? parts.slice(1).join(' ') : '' }
}

function buildDetailsBlob(payload: TastemakerApplicationPayload): string {
  const links = payload.socialLinks.filter(Boolean)
  return [
    links.length ? `Social profiles:\n${links.map((u, i) => `${i + 1}. ${u}`).join('\n')}` : '',
    payload.city.trim() ? `City: ${payload.city.trim()}` : '',
    payload.homeAnswer.trim() ? `What makes a house a home:\n${payload.homeAnswer.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')
}

function parseApplicationPayload(raw: string): TastemakerApplicationPayload | { error: string } {
  if (raw.length > 120_000) return { error: 'Payload too large' }
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return { error: 'Invalid JSON body' }
  }
  if (!body || typeof body !== 'object') return { error: 'Invalid body' }
  const o = body as Record<string, unknown>
  if (typeof o.fullName !== 'string') return { error: 'fullName is required' }
  if (typeof o.email !== 'string') return { error: 'email is required' }
  if (typeof o.city !== 'string') return { error: 'city is required' }
  if (typeof o.homeAnswer !== 'string') return { error: 'homeAnswer is required' }
  return {
    fullName: o.fullName,
    email: o.email,
    city: o.city,
    socialLinks: Array.isArray(o.socialLinks)
      ? o.socialLinks.filter((x): x is string => typeof x === 'string').slice(0, 5)
      : [],
    homeAnswer: o.homeAnswer,
  }
}

async function upsertContact(payload: TastemakerApplicationPayload, token: string, env: Record<string, string | undefined>) {
  const email = payload.email.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false as const, status: 400, message: 'Valid email is required.' }

  const { firstname, lastname } = splitName(payload.fullName)
  const properties: Record<string, string> = {
    email,
    ...(firstname.trim() ? { firstname: firstname.trim() } : {}),
    ...(lastname.trim() ? { lastname: lastname.trim() } : {}),
    ...(payload.city.trim() ? { city: payload.city.trim() } : {}),
    ...socialLinksToHubSpotProperties(payload.socialLinks),
  }

  const homeAnswerTrimmed = payload.homeAnswer.trim()
  if (homeAnswerTrimmed) properties[HUBSPOT_PROP_AFFILIATE_ANSWER] = homeAnswerTrimmed

  const detailsProp = env.HUBSPOT_APPLICATION_DETAILS_PROPERTY?.trim()
  const detailsBlob = buildDetailsBlob(payload)
  if (detailsProp && detailsBlob) properties[detailsProp] = detailsBlob

  const flagProp = env.HUBSPOT_APPLICANT_FLAG_PROPERTY?.trim()
  const flagVal = env.HUBSPOT_APPLICANT_FLAG_VALUE?.trim()
  if (flagProp && flagVal) properties[flagProp] = flagVal

  properties.customer_type = CUSTOMER_TYPE_AFFILIATE_APPLICANT

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const searchRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['email'],
      limit: 1,
    }),
  })
  if (!searchRes.ok) {
    const text = await searchRes.text()
    return { ok: false as const, status: 502, message: `HubSpot search failed (${searchRes.status}): ${text.slice(0, 280)}` }
  }

  const searchJson = (await searchRes.json()) as { results?: { id: string }[] }
  const existingId = searchJson.results?.[0]?.id

  if (existingId) {
    const patchRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${existingId}`, {
      method: 'PATCH', headers, body: JSON.stringify({ properties }),
    })
    if (!patchRes.ok) {
      const text = await patchRes.text()
      return { ok: false as const, status: 502, message: `HubSpot update failed (${patchRes.status}): ${text.slice(0, 280)}` }
    }
    return { ok: true as const, contactId: existingId, created: false }
  }

  const createRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
    method: 'POST', headers, body: JSON.stringify({ properties }),
  })
  if (!createRes.ok) {
    const text = await createRes.text()
    return { ok: false as const, status: 502, message: `HubSpot create failed (${createRes.status}): ${text.slice(0, 280)}` }
  }
  const created = (await createRes.json()) as { id?: string }
  if (!created.id) return { ok: false as const, status: 502, message: 'HubSpot create returned no contact id.' }
  return { ok: true as const, contactId: created.id, created: true }
}

// Named export so vite.config.ts dev proxy can reuse the same logic locally.
export async function handleSubmitApplicationRequest(jsonBody: string, env: Record<string, string | undefined>) {
  const token = env.HUBSPOT_PRIVATE_APP_ACCESS_TOKEN?.trim()
  if (!token) return { status: 500 as const, body: { ok: false as const, message: 'HubSpot is not configured.' } }

  const parsed = parseApplicationPayload(jsonBody)
  if ('error' in parsed) return { status: 400 as const, body: { ok: false as const, message: parsed.error } }

  try {
    const result = await upsertContact(parsed, token, env)
    if (!result.ok) {
      return { status: result.status >= 400 && result.status < 600 ? result.status : 502, body: { ok: false as const, message: result.message } }
    }
    return { status: 200 as const, body: { ok: true as const, contactId: result.contactId, created: result.created } }
  } catch (err) {
    console.error('[submit-application] unexpected error:', err)
    return { status: 500 as const, body: { ok: false as const, message: 'Internal server error' } }
  }
}

// ─── Vercel Serverless Function ───────────────────────────────────────────────

export default async function handler(
  req: { method?: string; body?: unknown },
  res: { status: (code: number) => typeof res; setHeader: (name: string, value: string) => void; json: (data: unknown) => void },
): Promise<void> {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' })
    return
  }

  const raw =
    typeof req.body === 'string' ? req.body
    : typeof req.body === 'object' && req.body !== null ? JSON.stringify(req.body)
    : '{}'

  const { status, body } = await handleSubmitApplicationRequest(raw, process.env as Record<string, string | undefined>)
  res.status(status).json(body)
}
