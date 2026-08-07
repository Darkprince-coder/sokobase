export type ListingStatus = "available" | "reserved" | "sold";

export type Condition = "New" | "Like New" | "Good" | "Fair" | "Needs Repair";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
}

export interface Listing {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string;
  price: number;
  condition: Condition;
  location: string;
  images: string[];
  status: ListingStatus;
  featured: boolean;
  verified: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export type RequestStatus = "open" | "fulfilled";

export interface ClientRequest {
  id: string;
  product_title: string;
  description: string;
  budget: number | null;
  status: RequestStatus;
  created_at: string;
  fulfilled_at: string | null;
}

export type RentalStatus = "available" | "rented";

export type HouseType =
  | "Single Room"
  | "Bedsitter"
  | "1 Bedroom"
  | "2 Bedroom"
  | "3 Bedroom+"
  | "Other";

export interface Rental {
  id: string;
  title: string;
  slug: string;
  description: string;
  monthly_rent: number;
  deposit: number | null;
  house_type: HouseType;
  location: string;
  distance_to_town: string | null;
  has_electricity: boolean;
  has_water: boolean;
  images: string[];
  status: RentalStatus;
  featured: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
}
