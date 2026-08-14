"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthedServerClient } from "@/lib/supabase/authServer";
import { slugify } from "@/lib/slug";
import type { MerchStatus } from "@/lib/types";

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
    .map((name, i) => ({ name: name.trim(), hex: (hexes[i] || "#000000").trim() }))
    .filter((c) => c.name);
}

export async function createMerchProduct(formData: FormData) {
  const supabase = createAuthedServerClient();
  const name = String(formData.get("name") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = rawSlug ? slugify(rawSlug) : slugify(name);

  const { error } = await supabase.from("merch_products").insert({
    name,
    slug,
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    category_id: String(formData.get("category_id") || "") || null,
    images: parseImages(String(formData.get("images") || "")),
    sizes: parseSizes(String(formData.get("sizes") || "")),
    colors: parseColors(formData),
    stock_count: Number(formData.get("stock_count") || 0),
    in_stock: formData.get("in_stock") !== "off",
    featured: formData.get("featured") === "on",
    status: String(formData.get("status") || "active") as MerchStatus,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/store/products");
  revalidatePath("/store");
  revalidatePath("/store/products");
  redirect("/admin/store/products");
}

export async function updateMerchProduct(id: string, formData: FormData) {
  const supabase = createAuthedServerClient();
  const name = String(formData.get("name") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = rawSlug ? slugify(rawSlug) : slugify(name);

  const { error } = await supabase
    .from("merch_products")
    .update({
      name,
      slug,
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price") || 0),
      category_id: String(formData.get("category_id") || "") || null,
      images: parseImages(String(formData.get("images") || "")),
      sizes: parseSizes(String(formData.get("sizes") || "")),
      colors: parseColors(formData),
      stock_count: Number(formData.get("stock_count") || 0),
      in_stock: formData.get("in_stock") !== "off",
      featured: formData.get("featured") === "on",
      status: String(formData.get("status") || "active") as MerchStatus,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/store/products");
  revalidatePath("/store");
  revalidatePath("/store/products");
  revalidatePath(`/store/products/${slug}`);
  redirect("/admin/store/products");
}

export async function deleteMerchProduct(id: string) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase.from("merch_products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/store/products");
  revalidatePath("/store");
}

export async function toggleMerchStock(id: string, inStock: boolean) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase
    .from("merch_products")
    .update({ in_stock: inStock })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/store/products");
  revalidatePath("/store");
}
