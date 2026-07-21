-- ============================================================
-- SokoBase — Migration 002: Client Requests + Trust Stats
-- Run this in Supabase SQL Editor AFTER supabase/schema.sql
-- (Project > SQL Editor > New query, paste, run)
-- ============================================================

-- ------------------------------------------------------------
-- Requests — "looking for a product we don't have listed."
-- Entered manually by the admin after a customer messages on
-- WhatsApp — there is no public form writing to this table.
-- ------------------------------------------------------------
create table requests (
  id uuid primary key default uuid_generate_v4(),
  product_title text not null,
  description text not null,
  budget numeric(12,2), -- optional, customer may not have one in mind
  status text not null default 'open' check (status in ('open', 'fulfilled')),
  created_at timestamptz default now(),
  fulfilled_at timestamptz
);

create index requests_status_idx on requests(status);

-- ------------------------------------------------------------
-- Request contact — requester name/phone, entered by admin.
-- Same pattern as listing_private: no public policy at all, so
-- this can never be exposed on the public requests board.
-- ------------------------------------------------------------
create table request_contact (
  request_id uuid primary key references requests(id) on delete cascade,
  requester_name text not null,
  requester_phone text not null,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Site stats — the trust-badge numbers shown on the homepage.
-- Items sold / transactions are computed live from real data
-- elsewhere; "satisfied customers" has no feedback/review system
-- yet, so it's a single manually-updated number you edit from
-- the admin dashboard.
-- ------------------------------------------------------------
create table site_stats (
  id smallint primary key default 1 check (id = 1), -- enforces a single row
  satisfied_customers int not null default 0,
  updated_at timestamptz default now()
);

insert into site_stats (id, satisfied_customers) values (1, 0)
  on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table requests enable row level security;
alter table request_contact enable row level security;
alter table site_stats enable row level security;

-- Requests board is public read-only; only the admin writes to it.
create policy "public can read requests"
  on requests for select
  using (true);

create policy "admin can manage requests"
  on requests for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Contact info is fully private — no public policy at all.
create policy "admin can manage request_contact"
  on request_contact for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- site_stats: public reads the number for the trust badge; only
-- admin updates it.
create policy "public can read site_stats"
  on site_stats for select
  using (true);

create policy "admin can manage site_stats"
  on site_stats for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- Explicit GRANTS required by newer Supabase projects
-- Any tables created in the public schema require explicit
-- GRANTs for Data API access (supabase-js / PostgREST / GraphQL)
-- See Supabase announcement: grant at least select to `anon`
-- for public read-only tables, and grant DML to `authenticated`
-- and `service_role` where appropriate.
-- ------------------------------------------------------------

-- Requests: public read-only board (anon may select)
grant select on public.requests to anon;
grant select, insert, update, delete on public.requests to authenticated;
grant select, insert, update, delete on public.requests to service_role;

-- Request contact: private data — do NOT grant anon select
grant select, insert, update, delete on public.request_contact to authenticated;
grant select, insert, update, delete on public.request_contact to service_role;

-- Site stats: public read; admin (authenticated) may update
grant select on public.site_stats to anon;
grant select, insert, update, delete on public.site_stats to authenticated;
grant select, insert, update, delete on public.site_stats to service_role;
