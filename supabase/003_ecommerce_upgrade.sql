-- ============================================================
-- SokoBase — Migration 003: E-commerce upgrade
-- Run in Supabase SQL Editor AFTER schema.sql + migration 002
-- Adds: old/new price (discount), product badges, brand/sku,
-- stock status, spec sheet — all needed for the storefront
-- redesign. WhatsApp checkout workflow is unchanged.
-- ============================================================

alter table listings
  add column if not exists compare_at_price numeric(12,2),
  add column if not exists badge text check (badge in ('new', 'hot', 'bestseller', 'limited') or badge is null),
  add column if not exists brand text,
  add column if not exists sku text,
  add column if not exists stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock', 'low_stock', 'out_of_stock')),
  add column if not exists specs jsonb not null default '[]'::jsonb;

comment on column listings.compare_at_price is 'Original/"was" price — shown struck through. Discount % is computed on the fly from (compare_at_price - price) / compare_at_price, never stored.';
comment on column listings.badge is 'Manual merchandising badge shown top-left of the product card.';
comment on column listings.specs is 'Array of {label, value} objects rendered as a spec table on the product page.';

-- No RLS/grant changes needed — these are just new columns on a
-- table that already has public-read / admin-write policies.
