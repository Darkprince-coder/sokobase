# SokoBase — Brand & Design System

## Signature idea: the inspection stamp

SokoBase's entire trust proposition is a physical act — someone at your
office actually looks the item over before money changes hands. Rather than
a generic checkmark badge (which any marketplace uses), the brand is built
around a **rubber-stamp seal**: a ticked/perforated circular mark with
"SOKOBASE" and "KIMANA · VERIFIED" arced around it. This shape reappears as
the logo mark, the "Verified" badge on product cards, and can extend to
section dividers later.

This replaces the original mockup's house+cart+speed-lines icon, which
combined three metaphors in one mark — hard to read at favicon size and not
specific to what actually makes SokoBase different (inspection, not just
"buy/sell/discover" like any e-commerce site).

**Center mark (revised in Session 2):** the seal's center is a location pin,
not a starburst — the first version's radiating-lines ornament read too
close to another well-known AI company's logo, so it was dropped. The pin
also does real narrative work: it says "verified, right here," and sets up
SokoBase's actual growth story — Kimana first, expanding across Kajiado as
trust builds — rather than implying a feature (like a house) that doesn't
exist yet.

## Color

| Token | Hex | Use |
|---|---|---|
| `--color-primary` (Soko Green) | `#1F7A4D` | CTAs, links, verified state |
| `--color-primary-dark` | `#14512F` | hover/active |
| `--color-primary-tint` | `#E8F2EC` | pale chips, backgrounds |
| `--color-charcoal` | `#14201B` | headings, body text |
| `--color-paper` | `#FAF7F2` | page background (warm, not clinical white) |
| `--color-sage` | `#DCE6DE` | borders, dividers |
| `--color-ochre` | `#C97A2B` | "Reserved" status, stamp accent |
| `--color-sold` | `#8A8F89` | "Sold" status — quietly out of the running |

Kept the brief's green-on-white direction (it's right for a trust-driven
marketplace) but warmed the white to a paper tone and added ochre as a
second accent so status badges (Available / Reserved / Sold) are
distinguishable at a glance, not just green-vs-gray.

## Type

- **Display — Space Grotesk**: headlines, prices in hero contexts. Geometric
  but slightly unusual, reads as "local tech-enabled shop," not generic
  corporate sans.
- **Body — Inter**: descriptions, UI copy. Chosen for legibility at small
  sizes on low-end Android screens, which is most of the actual traffic.
- **Mono — IBM Plex Mono**: prices, status badges, the stamp text. A
  monospace price reads like a printed price tag or receipt — a small
  detail that reinforces "this was actually checked and tagged by a person."

## Layout principles for Session 2

- Mobile-first: design every section for a ~375px viewport first, then
  expand. Most Kimana traffic will be Android/mobile.
- "How It Works" is a real 3-step sequence (WhatsApp → Inspect → Meet at
  office), so numbering it is justified — it's an actual process, not
  decoration.
- Status badges (`.status-available`, `.status-reserved`, `.status-sold` in
  `globals.css`) should appear on every product card, prominently — this is
  the site's core trust signal, not a minor detail.

## Assets

- `/public/brand/logo-mark.svg` — icon only, used as favicon/app icon and
  the "Verified" badge.
- `/public/brand/logo-full.svg` — mark + wordmark + tagline lockup, used in
  the header and any marketing material.

## Geographic framing (added Session 2)

Copy throughout the site now frames Kimana as the starting point, not the
ceiling — e.g. the hero eyebrow reads "Kimana · expanding across Kajiado."
This does two things: sets honest expectations for people outside Kimana who
land on the site, and turns the MVP's narrow scope into a deliberate,
confident choice ("we start here because we can inspect fast") rather than
a limitation.

## Tagline

Switched the primary tagline from "Buy. Sell. Discover." (generic — could
be any e-commerce site) to **"Everything Local. One Place."**, which leads
with the actual differentiator: hyperlocal trust, not feature breadth.
