import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Only run on /admin routes — public pages don't need session checks.
     */
    "/admin/:path*",
  ],
};
