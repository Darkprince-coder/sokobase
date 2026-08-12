"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthedServerClient } from "@/lib/supabase/authServer";
import { slugify, getUniqueSlug } from "@/lib/slug";
import type { HouseType, RentalCategory, RentalStatus } from "@/lib/types";

function parseImages(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createRental(formData: FormData) {
  const supabase = createAuthedServerClient();

  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(title);
  const slug = await getUniqueSlug(supabase, "rentals", baseSlug);

  const { data: rental, error } = await supabase
    .from("rentals")
    .insert({
      title,
      slug,
      description: String(formData.get("description") || ""),
      monthly_rent: Number(formData.get("monthly_rent") || 0),
      deposit: formData.get("deposit") ? Number(formData.get("deposit")) : null,
      house_type: String(formData.get("house_type") || "Other") as HouseType,
      rental_category: String(formData.get("rental_category") || "residential") as RentalCategory,
      location: String(formData.get("location") || "Kimana"),
      distance_to_town: String(formData.get("distance_to_town") || "") || null,
      has_electricity: formData.get("has_electricity") === "on",
      has_water: formData.get("has_water") === "on",
      images: parseImages(String(formData.get("images") || "")),
      featured: formData.get("featured") === "on",
      verified: formData.get("verified") !== "off",
      status: "available" as RentalStatus,
    })
    .select()
    .single();

  if (error || !rental) {
    throw new Error(error?.message || "Failed to create rental");
  }

  const landlordName = String(formData.get("landlord_name") || "").trim();
  const landlordPhone = String(formData.get("landlord_phone") || "").trim();

  if (landlordName && landlordPhone) {
    await supabase.from("rental_contact").insert({
      rental_id: rental.id,
      landlord_name: landlordName,
      landlord_phone: landlordPhone,
      intake_notes: String(formData.get("intake_notes") || ""),
    });
  }

  revalidatePath("/admin/rentals");
  revalidatePath("/rentals");
  revalidatePath("/");
  redirect("/admin/rentals");
}

export async function updateRental(id: string, formData: FormData) {
  const supabase = createAuthedServerClient();

  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(title);
  const slug = await getUniqueSlug(supabase, "rentals", baseSlug, id);

  const { error } = await supabase
    .from("rentals")
    .update({
      title,
      slug,
      description: String(formData.get("description") || ""),
      monthly_rent: Number(formData.get("monthly_rent") || 0),
      deposit: formData.get("deposit") ? Number(formData.get("deposit")) : null,
      house_type: String(formData.get("house_type") || "Other") as HouseType,
      rental_category: String(formData.get("rental_category") || "residential") as RentalCategory,
      location: String(formData.get("location") || "Kimana"),
      distance_to_town: String(formData.get("distance_to_town") || "") || null,
      has_electricity: formData.get("has_electricity") === "on",
      has_water: formData.get("has_water") === "on",
      images: parseImages(String(formData.get("images") || "")),
      featured: formData.get("featured") === "on",
      verified: formData.get("verified") !== "off",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const landlordName = String(formData.get("landlord_name") || "").trim();
  const landlordPhone = String(formData.get("landlord_phone") || "").trim();

  if (landlordName && landlordPhone) {
    await supabase.from("rental_contact").upsert({
      rental_id: id,
      landlord_name: landlordName,
      landlord_phone: landlordPhone,
      intake_notes: String(formData.get("intake_notes") || ""),
    });
  }

  revalidatePath("/admin/rentals");
  revalidatePath("/rentals");
  revalidatePath(`/rentals/${slug}`);
  redirect("/admin/rentals");
}

export async function deleteRental(id: string) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase.from("rentals").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/rentals");
  revalidatePath("/rentals");
  revalidatePath("/");
}

export async function setRentalStatus(id: string, status: RentalStatus) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase.from("rentals").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/rentals");
  revalidatePath("/rentals");
  revalidatePath("/");
}