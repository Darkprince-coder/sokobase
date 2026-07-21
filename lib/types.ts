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
