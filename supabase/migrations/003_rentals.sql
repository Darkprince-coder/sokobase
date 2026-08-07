-- ============================================================
-- SokoBase — Migration 003: Rentals
-- Run this in Supabase SQL Editor AFTER 001 (schema.sql) and,
-- if you ran it separately, 002 (client requests & trust stats).
-- ============================================================

-- ------------------------------------------------------------
-- Rentals — vacant houses for rent. Entered by admin from a
-- landlord conversation (WhatsApp, phone, or in person) — same
-- pattern as listings and requests, nothing public writes here.
-- ------------------------------------------------------------
create table rentals (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  monthly_rent numeric(12,2) not null check (monthly_rent >= 0),
  deposit numeric(12,2), -- optional, some landlords don't require one
  house_type text not null check (house_type in ('Single Room', 'Bedsitter', '1 Bedroom', '2 Bedroom', '3 Bedroom+', 'Other')),
  location text not null default 'Kimana',
  distance_to_town text, -- free text: "5 min boda ride", "2km", etc.
  has_electricity boolean not null default true,
  has_water boolean not null default true,
  images text[] not null default '{}',
  status text not null default 'available' check (status in ('available', 'rented')),
  featured boolean not null default false,
  verified boolean not null default true, -- true once physically inspected
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index rentals_status_idx on rentals(status);
create index rentals_house_type_idx on rentals(house_type);
create index rentals_featured_idx on rentals(featured);

create trigger rentals_set_updated_at
before update on rentals
for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- Rental contact — landlord identity, NEVER exposed publicly.
-- Same pattern as listing_private / request_contact.
-- ------------------------------------------------------------
create table rental_contact (
  rental_id uuid primary key references rentals(id) on delete cascade,
  landlord_name text not null,
  landlord_phone text not null,
  intake_notes text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table rentals enable row level security;
alter table rental_contact enable row level security;

create policy "public can read rentals"
  on rentals for select
  using (true);

create policy "admin can manage rentals"
  on rentals for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- rental_contact: no public policy at all — admin-only, full stop.
create policy "admin can manage rental_contact"
  on rental_contact for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- GRANTS — required separately from RLS (Supabase's Data API
-- policy change: RLS decides which ROWS a role can touch, these
-- GRANTs decide whether the role can reach the TABLE at all via
-- supabase-js/PostgREST/GraphQL). Without these, every query
-- below fails even with correct RLS policies above.
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant select on rentals to anon, authenticated;
grant insert, update, delete on rentals to authenticated;

grant select, insert, update, delete on rental_contact to authenticated;

grant select, insert, update, delete on rentals, rental_contact to service_role;
