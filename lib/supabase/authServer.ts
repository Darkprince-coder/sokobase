import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Use this anywhere you need the CURRENT ADMIN'S session — Server
 * Components under /admin, and Server Actions that write to listings,
 * listing_private, or sales. Unlike lib/supabaseServer.ts (plain anon
 * client, used for public pages), this one reads the session cookie so
 * Supabase's RLS sees the request as `authenticated`.
 */
export function createAuthedServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, any> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render (not an action/route
            // handler) — safe to ignore since middleware refreshes the
            // session cookie on every request anyway.
          }
        },
      },
    }
  );
}
