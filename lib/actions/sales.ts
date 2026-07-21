"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthedServerClient } from "@/lib/supabase/authServer";

export async function markSold(id: string, formData: FormData) {
  const supabase = createAuthedServerClient();

  const salePrice = Number(formData.get("sale_price") || 0);
  const commissionRaw = formData.get("commission_amount");
  const commission = commissionRaw ? Number(commissionRaw) : null;
  const notes = String(formData.get("notes") || "");

  const { error: saleError } = await supabase.from("sales").upsert(
    {
      listing_id: id,
      sale_price: salePrice,
      commission_amount: commission,
      notes,
    },
    { onConflict: "listing_id" }
  );

  if (saleError) throw new Error(saleError.message);

  const { error: statusError } = await supabase
    .from("listings")
    .update({ status: "sold" })
    .eq("id", id);

  if (statusError) throw new Error(statusError.message);

  revalidatePath("/admin/listings");
  revalidatePath("/admin/sales");
  revalidatePath("/");
  revalidatePath("/browse");
  redirect("/admin/listings");
}

export async function updateCommission(saleId: string, formData: FormData) {
  const supabase = createAuthedServerClient();

  const commissionRaw = formData.get("commission_amount");
  const commission = commissionRaw ? Number(commissionRaw) : null;

  const { error } = await supabase
    .from("sales")
    .update({ commission_amount: commission })
    .eq("id", saleId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/sales");
}
