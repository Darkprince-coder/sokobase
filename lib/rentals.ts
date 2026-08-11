import { createServerSupabase } from "./supabaseServer";
import type { Rental } from "./types";

export interface RentalFilters {
  houseType?: string;
  category?: string;
  maxRent?: number;
  minRent?: number;
  q?: string;
  sort?: "newest" | "rent_asc" | "rent_desc";
}

export async function getRentals(filters: RentalFilters = {}): Promise<Rental[]> {
  const supabase = createServerSupabase();
  let query = supabase.from("rentals").select("*");

  if (filters.category) {
    query = query.eq("rental_category", filters.category);
  }
  if (filters.houseType) {
    query = query.eq("house_type", filters.houseType);
  }
  if (filters.minRent !== undefined) {
    query = query.gte("monthly_rent", filters.minRent);
  }
  if (filters.maxRent !== undefined) {
    query = query.lte("monthly_rent", filters.maxRent);
  }
  if (filters.q) {
    query = query.ilike("title", `%${filters.q}%`);
  }

  switch (filters.sort) {
    case "rent_asc":
      query = query.order("monthly_rent", { ascending: true });
      break;
    case "rent_desc":
      query = query.order("monthly_rent", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("getRentals error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedRentals(limit = 3): Promise<Rental[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("rentals")
    .select("*")
    .eq("featured", true)
    .neq("status", "rented")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedRentals error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getLatestRentals(limit = 6): Promise<Rental[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("rentals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getLatestRentals error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getRentalBySlug(slug: string): Promise<Rental | null> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("rentals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getRentalBySlug error:", error.message);
    return null;
  }
  return data;
}

export async function getRelatedRentals(
  houseType: string,
  excludeId: string,
  limit = 3
): Promise<Rental[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("rentals")
    .select("*")
    .eq("house_type", houseType)
    .neq("id", excludeId)
    .neq("status", "rented")
    .limit(limit);

  if (error) {
    console.error("getRelatedRentals error:", error.message);
    return [];
  }
  return data ?? [];
}
