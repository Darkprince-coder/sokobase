-- Hometown SokoBase rebrand: adds a residential/commercial split to
-- rentals so business premises (shops, offices, warehouses) can be
-- listed alongside houses. Run this in Supabase SQL Editor after
-- migrations 001-003 have already been applied.

alter table rentals
  add column rental_category text not null default 'residential'
  check (rental_category in ('residential', 'commercial'));

create index rentals_category_idx on rentals(rental_category);

alter table rentals drop constraint if exists rentals_house_type_check;

alter table rentals
  add constraint rentals_house_type_check
  check (house_type in (
    'Single Room', 'Bedsitter', '1 Bedroom', '2 Bedroom', '3 Bedroom+',
    'Shop', 'Office', 'Warehouse', 'Commercial Plot', 'Other'
  ));
