"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthedServerClient } from "@/lib/supabase/authServer";
import { slugify, getUniqueSlug } from "@/lib/slug";
import type { Condition, ListingStatus, ListingType } from "@/lib/types";

function parseImages(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSizes(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseColors(formData: FormData): { name: string; hex: string }[] {
  const names = formData.getAll("color_name") as string[];
  const hexes = formData.getAll("color_hex") as string[];
  return names
    .map((name, i) => ({ name: name.trim(), hex: (hexes[i] || "#14201b").trim() }))
    .filter((c) => c.name);
}

function parseSpecs(formData: FormData): { label: string; value: string }[] {
  const labels = formData.getAll("spec_label") as string[];
  const values = formData.getAll("spec_value") as string[];
  return labels
    .map((label, i) => ({ label: label.trim(), value: (values[i] || "").trim() }))
    .filter((s) => s.label);
}

// New items are always "as-new" from the merchant, so the condition field
// is hidden in the admin form for listing_type = "new" and forced to
// "New" here — this is enforced server-side too, not just in the UI, so
// the data stays correct even if the hidden field is ever missing.
function resolveCondition(listingType: ListingType, formData: FormData): Condition {
  if (listingType === "new") return "New";
  return String(formData.get("condition") || "Good") as Condition;
}

export async function createListing(formData: FormData) {
  const supabase = createAuthedServerClient();

  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(title);
  const slug = await getUniqueSlug(supabase, "listings", baseSlug);

  const listingType = String(formData.get("listing_type") || "secondhand") as ListingType;
  const merchantName = String(formData.get("merchant_name") || "").trim();
  const condition = resolveCondition(listingType, formData);
  const compareAtPriceRaw = formData.get("compare_at_price");

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      title,
      slug,
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price") || 0),
      compare_at_price: compareAtPriceRaw ? Number(compareAtPriceRaw) : null,
      badge: String(formData.get("badge") || "").trim() || null,
      condition,
      location: String(formData.get("location") || "Kimana"),
      category_id: String(formData.get("category_id") || "") || null,
      images: parseImages(String(formData.get("images") || "")),
      specs: listingType === "new" ? parseSpecs(formData) : [],
      sizes: parseSizes(String(formData.get("sizes") || "")),
      colors: parseColors(formData),
      featured: formData.get("featured") === "on",
      verified: formData.get("verified") !== "off",
      status: "available" as ListingStatus,
      listing_type: listingType,
      merchant_name: listingType === "new" ? merchantName || null : null,
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
  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(title);
  const slug = await getUniqueSlug(supabase, "listings", baseSlug, id);

  const listingType = String(formData.get("listing_type") || "secondhand") as ListingType;
  const merchantName = String(formData.get("merchant_name") || "").trim();
  const condition = resolveCondition(listingType, formData);
  const compareAtPriceRaw = formData.get("compare_at_price");

  const { error } = await supabase
    .from("listings")
    .update({
      title,
      slug,
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price") || 0),
      compare_at_price: compareAtPriceRaw ? Number(compareAtPriceRaw) : null,
      badge: String(formData.get("badge") || "").trim() || null,
      condition,
      location: String(formData.get("location") || "Kimana"),
      category_id: String(formData.get("category_id") || "") || null,
      images: parseImages(String(formData.get("images") || "")),
      specs: listingType === "new" ? parseSpecs(formData) : [],
      sizes: parseSizes(String(formData.get("sizes") || "")),
      colors: parseColors(formData),
      featured: formData.get("featured") === "on",
      verified: formData.get("verified") !== "off",
      listing_type: listingType,
      merchant_name: listingType === "new" ? merchantName || null : null,
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
