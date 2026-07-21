"use server";

import { revalidatePath } from "next/cache";
import { createAuthedServerClient } from "@/lib/supabase/authServer";

export async function updateSiteStats(formData: FormData) {
  const supabase = createAuthedServerClient();

  const satisfiedCustomers = Number(formData.get("satisfied_customers") || 0);

  const { error } = await supabase
    .from("site_stats")
    .update({ satisfied_customers: satisfiedCustomers, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
