"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthedServerClient } from "@/lib/supabase/authServer";
import { slugify, getUniqueSlug } from "@/lib/slug";

export async function createCategory(formData: FormData) {
  const supabase = createAuthedServerClient();

  const name = String(formData.get("name") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(name);
  const slug = await getUniqueSlug(supabase, "categories", baseSlug);

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    icon: String(formData.get("icon") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/browse");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = createAuthedServerClient();

  const name = String(formData.get("name") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(name);
  const slug = await getUniqueSlug(supabase, "categories", baseSlug, id);

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      icon: String(formData.get("icon") || "").trim() || null,
      sort_order: Number(formData.get("sort_order") || 0),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/browse");
  revalidatePath("/");
  redirect("/admin/categories");
}

// Deleting a category is safe for existing listings — the schema's
// `category_id uuid references categories(id) on delete set null` means
// any listing that used this category just falls back to "Uncategorized"
// rather than being deleted or blocked.
export async function deleteCategory(id: string) {
  const supabase = createAuthedServerClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/browse");
  revalidatePath("/");
}
