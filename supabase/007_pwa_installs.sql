-- ============================================================
-- SokoBase — Migration 007: PWA install tracking
-- ------------------------------------------------------------
-- One row per successful "Add to Home Screen" / install, logged
-- client-side from the browser's `appinstalled` event via
-- POST /api/pwa/install. Write-only for visitors (anon can
-- insert but never read), read-only for the admin — same spirit
-- as an access log, not user-identifying data.
--
-- Run this in Supabase SQL Editor after schema.sql.
-- ============================================================

create table if not exists pwa_installs (
  id uuid primary key default uuid_generate_v4(),
  user_agent text,
  platform text,
  installed_at timestamptz default now()
);

create index if not exists pwa_installs_installed_at_idx on pwa_installs(installed_at);

alter table pwa_installs enable row level security;

create policy "anyone can log a pwa install"
  on pwa_installs for insert
  with check (true);

create policy "admin can view pwa installs"
  on pwa_installs for select
  using (auth.role() = 'authenticated');

create policy "admin can manage pwa installs"
  on pwa_installs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- GRANTS — required separately from RLS, same as every other
-- table in this project (see supabase/schema.sql for why).
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant insert on pwa_installs to anon, authenticated;
grant select, update, delete on pwa_installs to authenticated;

grant select, insert, update, delete on pwa_installs to service_role;
