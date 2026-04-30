import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SECURED_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SECURED_SUPABASE_PUBLISHABLE_KEY!;

export const securedSupabase = createClient(url, key);
