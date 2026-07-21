import { createBrowserClient } from "@supabase/ssr";

/**
 * Use this in Client Components ("use client").
 * For Server Components / Route Handlers, a separate server client
 * will be added in Session 3 alongside the admin auth work — the
 * browser client is all Session 1–2's public pages need, since they
 * only ever read public, RLS-open tables (categories, listings).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
