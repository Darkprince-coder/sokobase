import { createServerSupabase } from "./supabaseServer";
import type { MerchProduct, MerchCategory } from "./types";

const MERCH_SELECT = "*, category:merch_categories(*)";

export async function getMerchCategories(): Promise<MerchCategory[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("merch_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getMerchCategories error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedMerch(limit = 8): Promise<MerchProduct[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("merch_products")
    .select(MERCH_SELECT)
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getFeaturedMerch error:", error.message);
    return [];
  }
  return (data as unknown as MerchProduct[]) ?? [];
}

export interface MerchFilters {
  category?: string;
  q?: string;
  sort?: "newest" | "price_asc" | "price_desc";
}

export async function getMerchProducts(filters: MerchFilters = {}): Promise<MerchProduct[]> {
  const supabase = createServerSupabase();
  let query = supabase.from("merch_products").select(MERCH_SELECT).eq("status", "active");

  if (filters.category) {
    const { data: cat } = await supabase
      .from("merch_categories")
      .select("id")
      .eq("slug", filters.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (filters.q) query = query.ilike("name", `%${filters.q}%`);

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("getMerchProducts error:", error.message);
    return [];
  }
  return (data as unknown as MerchProduct[]) ?? [];
}

export async function getMerchProductBySlug(slug: string): Promise<MerchProduct | null> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("merch_products")
    .select(MERCH_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (error) {
    console.error("getMerchProductBySlug error:", error.message);
    return null;
  }
  return data as unknown as MerchProduct;
}

export async function getMerchProductCount(): Promise<number> {
  const supabase = createServerSupabase();
  const { count } = await supabase
    .from("merch_products")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");
  return count ?? 0;
}
