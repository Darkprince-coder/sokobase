-- ============================================================
-- SokoBase — Migration 006: Product card upgrade
-- ------------------------------------------------------------
-- Adds everything needed for the ecommerce-style product cards:
--   - compare_at_price  -> "old price", struck through, discount
--                          % is computed on the fly in the app,
--                          never stored
--   - badge             -> free-text merchandising tag ("Hot
--                          Deal", "Offer", "Bestseller"...),
--                          separate from the automatic New /
--                          Secondhand tag
--   - specs             -> spec-sheet rows for new/dropshipped
--                          items, e.g. [{"label":"Battery",
--                          "value":"Up to 7 days"}]
--   - sizes / colors     -> optional variant selectors, usable
--                          on either new or secondhand listings
--
-- Safe to run whether or not you previously ran
-- 003_ecommerce_upgrade.sql — every column uses IF NOT EXISTS,
-- and the old fixed-value check constraint on `badge` (from that
-- earlier migration) is dropped so you can type any badge label
-- freely instead of being limited to new/hot/bestseller/limited.
--
-- Run this in Supabase SQL Editor. No RLS or GRANT changes are
-- needed — these are new columns on a table (`listings`) that
-- already has public-read / admin-write policies from
-- supabase/schema.sql.
-- ============================================================

alter table listings
  add column if not exists compare_at_price numeric(12,2),
  add column if not exists badge text,
  add column if not exists specs jsonb not null default '[]'::jsonb,
  add column if not exists sizes text[] not null default '{}',
  add column if not exists colors jsonb not null default '[]'::jsonb;

-- Drop the old fixed-value constraint on badge, if it exists.
alter table listings drop constraint if exists listings_badge_check;

comment on column listings.compare_at_price is
  'Original/"was" price, shown struck through on the card and product page. Discount % is computed as (compare_at_price - price) / compare_at_price at render time — never stored. Null = no discount shown.';

comment on column listings.badge is
  'Free-text merchandising badge shown on the card, e.g. "Hot Deal", "Offer", "Bestseller", "Back in Stock". Separate from the automatic New/Secondhand tag. Null = no badge.';

comment on column listings.specs is
  'Spec-sheet rows for the product page, e.g. [{"label":"Battery","value":"Up to 7 days"}]. Used mainly for new/dropshipped goods.';

comment on column listings.sizes is
  'Optional size options, e.g. {S,M,L,XL}. Empty array = no size selector shown on the product page. Usable on new or secondhand listings.';

comment on column listings.colors is
  'Optional color options as [{"name":"Black","hex":"#14201B"}]. Empty array = no color selector shown. Usable on new or secondhand listings.';
