import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSecuredSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SECURED_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SECURED_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key);
  return _client;
}
