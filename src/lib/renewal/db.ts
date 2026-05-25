// Supabase Postgres client for renewal flow.
//
// Reads tenants and writes events/renewals into the `renewals` schema shared
// with the flent-renewals app. Server-only — never expose to the browser.

import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;
let _sql: Sql | null = null;

function client(): Sql {
  if (_sql) return _sql;
  const url = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("SUPABASE_DB_URL is not set for renewal flow.");
  }
  _sql = postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    onnotice: () => {},
    connection: { search_path: "renewals, public" },
  });
  return _sql;
}

export function renewalDb(): Sql {
  return client();
}

export type Tenant = {
  id: number;
  token: string;
  name: string;
  email: string;
  phone: string | null;
  property: string | null;
  pid: string | null;
  rid: string | null;
  current_rent: number;
  escalation_pct: number;
  move_in_date: string | null;
  move_out_date: string | null;
  current_lock_in: string | null;
  created_at: string | Date;
};

export type EventType =
  | "email_sent"
  | "email_opened"
  | "email_link_clicked"
  | "page_viewed"
  | "tier_clicked"
  | "tier_selected"
  | "cta_callback_clicked"
  | "cta_whatsapp_clicked"
  | "cta_pick_renewal_clicked"
  | "renewal_confirmed"
  | "reminder_sent"
  | "whatsapp_sent"
  | "whatsapp_failed";

export async function getTenantByToken(token: string): Promise<Tenant | undefined> {
  const rows = await client()<Tenant[]>`
    SELECT * FROM tenants WHERE token = ${token} LIMIT 1
  `;
  return rows[0];
}

export async function logEvent(
  tenantId: number,
  type: EventType,
  meta?: Record<string, unknown>,
  ua?: string | null,
  ip?: string | null,
): Promise<void> {
  const sql = client();
  const metaJson = meta ? sql.json(meta as never) : null;
  await sql`
    INSERT INTO events (tenant_id, type, meta_json, user_agent, ip)
    VALUES (${tenantId}, ${type}, ${metaJson}, ${ua ?? null}, ${ip ?? null})
  `;
}

export type ConfirmedRenewal = {
  selected_tier: string;
  new_rent: number;
  monthly_savings: number;
};

export async function upsertRenewal(
  tenantId: number,
  selectedTier: string,
  newRent: number,
  monthlySavings: number,
): Promise<void> {
  await client()`
    INSERT INTO renewals (tenant_id, selected_tier, new_rent, monthly_savings)
    VALUES (${tenantId}, ${selectedTier}, ${newRent}, ${monthlySavings})
    ON CONFLICT (tenant_id) DO UPDATE SET
      selected_tier   = EXCLUDED.selected_tier,
      new_rent        = EXCLUDED.new_rent,
      monthly_savings = EXCLUDED.monthly_savings,
      confirmed_at    = NOW()
  `;
}

export async function getRenewalForTenant(tenantId: number): Promise<ConfirmedRenewal | undefined> {
  const rows = await client()<ConfirmedRenewal[]>`
    SELECT selected_tier, new_rent, monthly_savings
    FROM renewals WHERE tenant_id = ${tenantId} LIMIT 1
  `;
  return rows[0];
}
