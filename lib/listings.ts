import { createServerSupabase } from "./supabaseServer";
import type { Listing, Category } from "./types";

const LISTING_SELECT = "*, category:categories(*)";

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("featured", true)
    .neq("status", "sold")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedListings error:", error.message);
    return [];
  }
  return (data as unknown as Listing[]) ?? [];
}

export async function getLatestListings(limit = 8): Promise<Listing[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getLatestListings error:", error.message);
    return [];
  }
  return (data as unknown as Listing[]) ?? [];
}

export interface BrowseFilters {
  category?: string; // category slug
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string; // search term against title
  sort?: "newest" | "price_asc" | "price_desc";
}

export async function getListings(filters: BrowseFilters = {}): Promise<Listing[]> {
  const supabase = createServerSupabase();
  let query = supabase.from("listings").select(LISTING_SELECT);

  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (filters.condition) {
    query = query.eq("condition", filters.condition);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.q) {
    query = query.ilike("title", `%${filters.q}%`);
  }

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
    console.error("getListings error:", error.message);
    return [];
  }
  return (data as unknown as Listing[]) ?? [];
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getListingBySlug error:", error.message);
    return null;
  }
  return data as unknown as Listing;
}

export async function getRelatedListings(
  categoryId: string | null,
  excludeId: string,
  limit = 4
): Promise<Listing[]> {
  if (!categoryId) return [];
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .neq("status", "sold")
    .limit(limit);

  if (error) {
    console.error("getRelatedListings error:", error.message);
    return [];
  }
  return (data as unknown as Listing[]) ?? [];
}
