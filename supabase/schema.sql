-- ============================================================
-- SokoBase — Full Database Schema (consolidated, with explicit
-- Data API grants required by Supabase's Oct 30 policy change)
-- ============================================================
-- This file replaces supabase/schema.sql AND
-- supabase/migrations/002_client_requests_and_trust_stats.sql —
-- it's the single source of truth going forward.
--
-- Why this changed: Supabase no longer auto-exposes tables in the
-- "public" schema to the Data API (supabase-js/PostgREST/GraphQL).
-- RLS policies alone are no longer enough — every table now also
-- needs an explicit GRANT per role, or that role gets zero access
-- regardless of what its RLS policies say.
--
-- HOW TO RUN THIS:
-- - Brand new Supabase project: run this whole file once, top to
--   bottom, in SQL Editor. That's it.
-- - Project you already set up (from earlier sessions): your
--   tables already exist, so the `create table` lines will error.
--   Skip to the "GRANTS" section near the bottom and run just that
--   part — it's safe to run on existing tables and is the only
--   part you actually need for this update.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- Categories
-- ------------------------------------------------------------
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  icon text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Listings — everything shown publicly on the site
-- ------------------------------------------------------------
create table listings (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null,
  price numeric(12,2) not null check (price >= 0),
  condition text not null check (condition in ('New', 'Like New', 'Good', 'Fair', 'Needs Repair')),
  location text not null default 'Kimana',
  images text[] not null default '{}',
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  featured boolean not null default false,
  verified boolean not null default true,
  view_count int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index listings_status_idx on listings(status);
create index listings_category_idx on listings(category_id);
create index listings_featured_idx on listings(featured);

-- ------------------------------------------------------------
-- Listing private details — seller identity, NEVER public.
-- ------------------------------------------------------------
create table listing_private (
  listing_id uuid primary key references listings(id) on delete cascade,
  seller_name text not null,
  seller_phone text not null,
  intake_notes text,
  intake_date date,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Sales — filled in by admin after marking a listing sold.
-- ------------------------------------------------------------
create table sales (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null unique references listings(id) on delete cascade,
  sale_price numeric(12,2) not null,
  commission_amount numeric(12,2),
  seller_payout numeric(12,2) generated always as (sale_price - coalesce(commission_amount, 0)) stored,
  sold_at timestamptz default now(),
  notes text
);

-- ------------------------------------------------------------
-- Requests — "looking for a product we don't have listed."
-- Entered manually by the admin after a WhatsApp conversation.
-- ------------------------------------------------------------
create table requests (
  id uuid primary key default uuid_generate_v4(),
  product_title text not null,
  description text not null,
  budget numeric(12,2),
  status text not null default 'open' check (status in ('open', 'fulfilled')),
  created_at timestamptz default now(),
  fulfilled_at timestamptz
);

create index requests_status_idx on requests(status);

-- ------------------------------------------------------------
-- Request contact — requester name/phone, entered by admin.
-- Same privacy pattern as listing_private: no public access.
-- ------------------------------------------------------------
create table request_contact (
  request_id uuid primary key references requests(id) on delete cascade,
  requester_name text not null,
  requester_phone text not null,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Site stats — the homepage trust-badge numbers.
-- ------------------------------------------------------------
create table site_stats (
  id smallint primary key default 1 check (id = 1),
  satisfied_customers int not null default 0,
  updated_at timestamptz default now()
);

insert into site_stats (id, satisfied_customers) values (1, 0)
  on conflict (id) do nothing;

-- ------------------------------------------------------------
-- updated_at trigger for listings
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_set_updated_at
before update on listings
for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table categories enable row level security;
alter table listings enable row level security;
alter table listing_private enable row level security;
alter table sales enable row level security;
alter table requests enable row level security;
alter table request_contact enable row level security;
alter table site_stats enable row level security;

create policy "public can read categories" on categories for select using (true);
create policy "admin can manage categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public can read listings" on listings for select using (true);
create policy "admin can manage listings" on listings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- listing_private: no public policy at all — admin-only, full stop.
create policy "admin can manage listing_private" on listing_private for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin can manage sales" on sales for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public can read requests" on requests for select using (true);
create policy "admin can manage requests" on requests for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- request_contact: no public policy at all — admin-only, full stop.
create policy "admin can manage request_contact" on request_contact for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public can read site_stats" on site_stats for select using (true);
create policy "admin can manage site_stats" on site_stats for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- GRANTS — required separately from RLS as of Supabase's Data
-- API policy change. RLS decides which ROWS a role can touch;
-- these GRANTs decide whether the role can reach the TABLE at
-- all via supabase-js/PostgREST/GraphQL. Without these, every
-- query below will fail even though the RLS policies above are
-- otherwise correct.
--
-- This is the only section you need to run on a project that
-- already has all the tables above created.
-- ============================================================

grant usage on schema public to anon, authenticated, service_role;

-- Publicly browsable tables: anon (visitors) gets read-only,
-- authenticated (admin) gets full read/write.
grant select on categories to anon, authenticated;
grant insert, update, delete on categories to authenticated;

grant select on listings to anon, authenticated;
grant insert, update, delete on listings to authenticated;

grant select on requests to anon, authenticated;
grant insert, update, delete on requests to authenticated;

grant select on site_stats to anon, authenticated;
grant insert, update, delete on site_stats to authenticated;

-- Fully private tables: admin only, no anon grant at all — so
-- even if a policy were ever misconfigured, anon has zero table
-- access as a hard backstop.
grant select, insert, update, delete on listing_private to authenticated;
grant select, insert, update, delete on sales to authenticated;
grant select, insert, update, delete on request_contact to authenticated;

-- service_role bypasses RLS entirely and is only used if you ever
-- add server-side jobs that need unrestricted access — not used by
-- the app today, but granted for completeness/future-proofing.
grant select, insert, update, delete on
  categories, listings, listing_private, sales, requests, request_contact, site_stats
  to service_role;
