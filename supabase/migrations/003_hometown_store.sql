-- ============================================================
-- SokoBase — Migration 003: Hometown Store (branded merchandise)
-- Run this in Supabase SQL Editor AFTER supabase/schema.sql
-- (Project > SQL Editor > New query, paste, run)
-- ============================================================

create table merch_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table merch_products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references merch_categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  images text[] not null default '{}',
  sizes text[] not null default '{}',        -- e.g. {S,M,L,XL,XXL}
  colors jsonb not null default '[]',         -- e.g. [{"name":"Black","hex":"#14201B"}]
  stock_count int not null default 0,
  in_stock boolean not null default true,
  featured boolean not null default false,
  status text not null default 'active' check (status in ('active','inactive')),
  view_count int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index merch_products_status_idx on merch_products(status);
create index merch_products_category_idx on merch_products(category_id);

-- Reuses the set_updated_at() function created in supabase/schema.sql.
-- If you haven't run schema.sql (or dropped the function), create it first:
--
-- create or replace function set_updated_at()
-- returns trigger as $$
-- begin
--   new.updated_at = now();
--   return new;
-- end;
-- $$ language plpgsql;

create trigger merch_products_set_updated_at
before update on merch_products
for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table merch_categories enable row level security;
alter table merch_products enable row level security;

create policy "public can read merch_categories" on merch_categories for select using (true);
create policy "admin can manage merch_categories" on merch_categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Public only sees active products; admin (authenticated) sees everything.
create policy "public can read active merch_products" on merch_products for select
  using (status = 'active' or auth.role() = 'authenticated');
create policy "admin can manage merch_products" on merch_products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- Explicit GRANTS (required by newer Supabase projects — see
-- the note at the top of supabase/schema.sql for why)
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant select on merch_categories to anon, authenticated;
grant insert, update, delete on merch_categories to authenticated;

grant select on merch_products to anon, authenticated;
grant insert, update, delete on merch_products to authenticated;

grant select, insert, update, delete on merch_categories, merch_products to service_role;
