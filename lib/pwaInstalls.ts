import { createAuthedServerClient } from "@/lib/supabase/authServer";

export async function getPwaInstallCount(): Promise<number> {
  const supabase = createAuthedServerClient();
  const { count, error } = await supabase
    .from("pwa_installs")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("getPwaInstallCount error:", error.message);
    return 0;
  }
  return count ?? 0;
}
