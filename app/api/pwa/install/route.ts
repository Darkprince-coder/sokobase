import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as Record<string, unknown>));
  const supabase = createServerSupabase();

  const { error } = await supabase.from("pwa_installs").insert({
    user_agent: typeof body.userAgent === "string" ? body.userAgent.slice(0, 300) : null,
    platform: typeof body.platform === "string" ? body.platform.slice(0, 100) : null,
  });

  if (error) {
    console.error("pwa install log error:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
