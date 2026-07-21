import { createClient } from "@supabase/supabase-js";

/**
 * Server Components read-only client. Categories and listings both have
 * public RLS read policies (see supabase/schema.sql), so this plain anon
 * client is enough — no user session/cookies needed for public browsing.
 * Admin auth (Session 3) will use a separate cookie-aware client.
 */
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
