import { createAuthedServerClient } from "@/lib/supabase/authServer";
import type { Listing } from "@/lib/types";

const LISTING_SELECT = "*, category:categories(*)";

export async function getAdminListings(): Promise<Listing[]> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminListings error:", error.message);
    return [];
  }
  return (data as unknown as Listing[]) ?? [];
}

export interface AdminListingDetail extends Listing {
  listing_private: {
    seller_name: string;
    seller_phone: string;
    intake_notes: string | null;
    intake_date: string | null;
  } | null;
}

export async function getAdminListing(id: string): Promise<AdminListingDetail | null> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select(`${LISTING_SELECT}, listing_private(*)`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("getAdminListing error:", error.message);
    return null;
  }

  const row = data as any;
  return {
    ...row,
    listing_private: Array.isArray(row.listing_private)
      ? row.listing_private[0] ?? null
      : row.listing_private ?? null,
  };
}

export interface SaleRow {
  id: string;
  listing_id: string;
  sale_price: number;
  commission_amount: number | null;
  seller_payout: number;
  sold_at: string;
  notes: string | null;
  listing: { title: string; slug: string } | null;
}

export async function getSales(): Promise<SaleRow[]> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("sales")
    .select("*, listing:listings(title, slug)")
    .order("sold_at", { ascending: false });

  if (error) {
    console.error("getSales error:", error.message);
    return [];
  }
  return (data as unknown as SaleRow[]) ?? [];
}

export async function getDashboardStats() {
  const supabase = createAuthedServerClient();

  const [
    { count: total },
    { count: available },
    { count: reserved },
    { count: sold },
    { count: openRequests },
    sales,
  ] = await Promise.all([
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "available"),
    supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "reserved"),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "sold"),
    supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "open"),
    getSales(),
  ]);

  const totalCommission = sales.reduce((sum, s) => sum + (s.commission_amount ?? 0), 0);
  const pendingCommission = sales.filter((s) => s.commission_amount === null).length;

  return {
    total: total ?? 0,
    available: available ?? 0,
    reserved: reserved ?? 0,
    sold: sold ?? 0,
    openRequests: openRequests ?? 0,
    totalCommission,
    pendingCommission,
    recentSales: sales.slice(0, 5),
  };
}

export interface AdminRequest {
  id: string;
  product_title: string;
  description: string;
  budget: number | null;
  status: "open" | "fulfilled";
  created_at: string;
  fulfilled_at: string | null;
  request_contact: {
    requester_name: string;
    requester_phone: string;
  } | null;
}

export async function getAdminRequests(): Promise<AdminRequest[]> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, request_contact(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminRequests error:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    ...row,
    request_contact: Array.isArray(row.request_contact)
      ? row.request_contact[0] ?? null
      : row.request_contact ?? null,
  }));
}

export async function getAdminRequest(id: string): Promise<AdminRequest | null> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, request_contact(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getAdminRequest error:", error.message);
    return null;
  }

  const row = data as any;
  return {
    ...row,
    request_contact: Array.isArray(row.request_contact)
      ? row.request_contact[0] ?? null
      : row.request_contact ?? null,
  };
}

export async function getSiteStats(): Promise<{ satisfiedCustomers: number }> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("site_stats")
    .select("satisfied_customers")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("getSiteStats error:", error.message);
    return { satisfiedCustomers: 0 };
  }
  return { satisfiedCustomers: data?.satisfied_customers ?? 0 };
}
