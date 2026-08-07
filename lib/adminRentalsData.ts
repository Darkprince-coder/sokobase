import { createAuthedServerClient } from "@/lib/supabase/authServer";
import type { Rental } from "@/lib/types";

export async function getAdminRentals(): Promise<Rental[]> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("rentals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminRentals error:", error.message);
    return [];
  }
  return data ?? [];
}

export interface AdminRentalDetail extends Rental {
  rental_contact: {
    landlord_name: string;
    landlord_phone: string;
    intake_notes: string | null;
  } | null;
}

export async function getAdminRental(id: string): Promise<AdminRentalDetail | null> {
  const supabase = createAuthedServerClient();
  const { data, error } = await supabase
    .from("rentals")
    .select("*, rental_contact(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getAdminRental error:", error.message);
    return null;
  }

  const row = data as any;
  return {
    ...row,
    rental_contact: Array.isArray(row.rental_contact)
      ? row.rental_contact[0] ?? null
      : row.rental_contact ?? null,
  };
}
