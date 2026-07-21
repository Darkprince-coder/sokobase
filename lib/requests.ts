import { createServerSupabase } from "./supabaseServer";
import type { ClientRequest } from "./types";

export async function getOpenRequests(limit = 20): Promise<ClientRequest[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getOpenRequests error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFulfilledRequests(limit = 10): Promise<ClientRequest[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("status", "fulfilled")
    .order("fulfilled_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFulfilledRequests error:", error.message);
    return [];
  }
  return data ?? [];
}

export interface TrustStats {
  itemsSold: number;
  transactionsCompleted: number;
  satisfiedCustomers: number;
}

export async function getTrustStats(): Promise<TrustStats> {
  const supabase = createServerSupabase();

  const [{ count: itemsSold }, { count: transactionsCompleted }, { data: stats }] =
    await Promise.all([
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "sold"),
      supabase.from("sales").select("*", { count: "exact", head: true }),
      supabase.from("site_stats").select("satisfied_customers").eq("id", 1).single(),
    ]);

  return {
    itemsSold: itemsSold ?? 0,
    transactionsCompleted: transactionsCompleted ?? 0,
    satisfiedCustomers: stats?.satisfied_customers ?? 0,
  };
}
