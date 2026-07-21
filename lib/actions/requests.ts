"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthedServerClient } from "@/lib/supabase/authServer";

export async function createRequest(formData: FormData) {
  const supabase = createAuthedServerClient();

  const { data: request, error } = await supabase
    .from("requests")
    .insert({
      product_title: String(formData.get("product_title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      budget: formData.get("budget") ? Number(formData.get("budget")) : null,
    })
    .select()
    .single();

  if (error || !request) {
    throw new Error(error?.message || "Failed to create request");
  }

  const requesterName = String(formData.get("requester_name") || "").trim();
  const requesterPhone = String(formData.get("requester_phone") || "").trim();

  if (requesterName && requesterPhone) {
    await supabase.from("request_contact").insert({
      request_id: request.id,
      requester_name: requesterName,
      requester_phone: requesterPhone,
    });
  }

  revalidatePath("/admin/requests");
  revalidatePath("/requests");
  revalidatePath("/");
  redirect("/admin/requests");
}

export async function updateRequest(id: string, formData: FormData) {
  const supabase = createAuthedServerClient();

  const { error } = await supabase
    .from("requests")
    .update({
      product_title: String(formData.get("product_title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      budget: formData.get("budget") ? Number(formData.get("budget")) : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const requesterName = String(formData.get("requester_name") || "").trim();
  const requesterPhone = String(formData.get("requester_phone") || "").trim();

  if (requesterName && requesterPhone) {
    await supabase.from("request_contact").upsert({
      request_id: id,
      requester_name: requesterName,
      requester_phone: requesterPhone,
    });
  }

  revalidatePath("/admin/requests");
  revalidatePath("/requests");
  redirect("/admin/requests");
}

export async function markRequestFulfilled(id: string) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase
    .from("requests")
    .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/requests");
  revalidatePath("/requests");
  revalidatePath("/");
}

export async function reopenRequest(id: string) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase
    .from("requests")
    .update({ status: "open", fulfilled_at: null })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/requests");
  revalidatePath("/requests");
  revalidatePath("/");
}

export async function deleteRequest(id: string) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase.from("requests").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/requests");
  revalidatePath("/requests");
  revalidatePath("/");
}
