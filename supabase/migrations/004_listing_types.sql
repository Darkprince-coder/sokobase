-- ============================================================
-- SokoBase — Migration 004: New Items support (listing_type)
-- ------------------------------------------------------------
-- Run this in Supabase SQL Editor AFTER schema.sql (and 003 if
-- you've applied rentals). Safe to run on an EXISTING listings
-- table — it only adds columns with a default, so every current
-- row is automatically tagged 'secondhand' and nothing on the
-- live site breaks when you run this.
-- ============================================================

alter table listings
  add column if not exists listing_type text not null default 'secondhand'
    check (listing_type in ('secondhand', 'new')),
  add column if not exists merchant_name text;

create index if not exists listings_type_idx on listings(listing_type);

comment on column listings.listing_type is
  'secondhand = existing marketplace item (default). new = admin-posted new product from a merchant/partner, per the commission model.';
comment on column listings.merchant_name is
  'Only relevant when listing_type = new. Shown publicly to credit the supplying merchant. Null/blank for secondhand items.';

-- No RLS or GRANT changes needed — listing_type and merchant_name
-- are columns on the existing `listings` table, which already has
-- public select + authenticated all policies and grants from
-- schema.sql. Nothing else to run.
