"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthedServerClient } from "@/lib/supabase/authServer";
import { slugify } from "@/lib/slug";
import type { Condition, ListingStatus } from "@/lib/types";

function parseImages(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createListing(formData: FormData) {
  const supabase = createAuthedServerClient();

  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      title,
      slug,
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price") || 0),
      condition: String(formData.get("condition") || "Good") as Condition,
      location: String(formData.get("location") || "Kimana"),
      category_id: String(formData.get("category_id") || "") || null,
      images: parseImages(String(formData.get("images") || "")),
      featured: formData.get("featured") === "on",
      verified: formData.get("verified") !== "off",
      status: "available" as ListingStatus,
    })
    .select()
    .single();

  if (error || !listing) {
    throw new Error(error?.message || "Failed to create listing");
  }

  const sellerName = String(formData.get("seller_name") || "").trim();
  const sellerPhone = String(formData.get("seller_phone") || "").trim();

  if (sellerName && sellerPhone) {
    await supabase.from("listing_private").insert({
      listing_id: listing.id,
      seller_name: sellerName,
      seller_phone: sellerPhone,
      intake_notes: String(formData.get("intake_notes") || ""),
      intake_date: String(formData.get("intake_date") || "") || null,
    });
  }

  revalidatePath("/admin/listings");
  revalidatePath("/");
  revalidatePath("/browse");
  redirect("/admin/listings");
}

export async function updateListing(id: string, formData: FormData) {
  const supabase = createAuthedServerClient();

  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);

  const { error } = await supabase
    .from("listings")
    .update({
      title,
      slug,
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price") || 0),
      condition: String(formData.get("condition") || "Good") as Condition,
      location: String(formData.get("location") || "Kimana"),
      category_id: String(formData.get("category_id") || "") || null,
      images: parseImages(String(formData.get("images") || "")),
      featured: formData.get("featured") === "on",
      verified: formData.get("verified") !== "off",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const sellerName = String(formData.get("seller_name") || "").trim();
  const sellerPhone = String(formData.get("seller_phone") || "").trim();

  if (sellerName && sellerPhone) {
    await supabase.from("listing_private").upsert({
      listing_id: id,
      seller_name: sellerName,
      seller_phone: sellerPhone,
      intake_notes: String(formData.get("intake_notes") || ""),
      intake_date: String(formData.get("intake_date") || "") || null,
    });
  }

  revalidatePath("/admin/listings");
  revalidatePath("/");
  revalidatePath("/browse");
  revalidatePath(`/listings/${slug}`);
  redirect("/admin/listings");
}

export async function deleteListing(id: string) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/listings");
  revalidatePath("/");
  revalidatePath("/browse");
}

export async function setListingStatus(id: string, status: ListingStatus) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase.from("listings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/listings");
  revalidatePath("/");
  revalidatePath("/browse");
}
