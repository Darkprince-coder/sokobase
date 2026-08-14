import { createAuthedServerClient } from "@/lib/supabase/authServer";
import type { MerchProduct } from "@/lib/types";

const MERCH_SELECT = "*, category:merch_categories(*)";

export async function getAdminMerchProducts(): Promise<MerchProduct[]> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("merch_products")
    .select(MERCH_SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAdminMerchProducts error:", error.message);
    return [];
  }
  return (data as unknown as MerchProduct[]) ?? [];
}

export async function getAdminMerchProduct(id: string): Promise<MerchProduct | null> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("merch_products")
    .select(MERCH_SELECT)
    .eq("id", id)
    .single();
  if (error) {
    console.error("getAdminMerchProduct error:", error.message);
    return null;
  }
  return data as unknown as MerchProduct;
}
