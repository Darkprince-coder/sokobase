# SokoBase — Update: Motion, Icons &amp; Copy Rewrite

This update only touches the **public site** (Home, Browse, Categories,
Product pages, Requests, About, Contact, 404/error pages) — the admin
dashboard is untouched, as you asked. Zip contains the complete project.

## 1. Install the two new packages

```bash
npm install
```

This pulls in two new dependencies:

- **framer-motion** — powers the animations
- **lucide-react** — the icon set used everywhere

## 2. What changed

**Motion, used subtly throughout:**
- Sections fade and slide up into place as you scroll down any page
- Listing cards lift slightly and stagger in one after another
- Cards give a small press-down feel on tap (nice on mobile)
- The mobile nav menu slides open/closed instead of snapping
- Product photos crossfade instead of hard-cutting between thumbnails
- Everything respects "reduce motion" settings for anyone who has that
  turned on at the OS level — animations just turn off for them, no
  broken layout

**Icons, from Lucide, replacing plain text/checkmarks:**
- Verified badges, status badges (available/reserved/sold)
- Every WhatsApp button now has a message icon
- Trust features, footer trust list, About page sections
- Category arrows, "view all" links, empty states (search icon when
  nothing matches your filters, camera icon for missing photos)
- Header menu (proper open/close icons instead of a custom CSS hamburger)

**Copy rewrite** — went through every line of public-facing text and
cut the long dashes and stiff phrasing. A few examples of the shift:

- "Buy & Sell Locally With Confidence in Kimana" &rarr; "Buy & Sell
  Locally in Kimana"
- "Latest listings" &rarr; "Just listed"
- "Can't find what you're looking for?" &rarr; "Can't find it? Ask us."
- "Inspect the item carefully at our office before paying, once payment
  is made there are no refunds" &rarr; "Inspect before you pay. No
  refunds after payment."

Shorter sentences, more direct, and it should read like a person wrote
it, not a corporate FAQ page.

## 3. Nothing to configure

No new environment variables, no database changes. This is purely a
frontend update — pull it in, run `npm install`, and it's ready.

## What's in this delivery (files touched)

```
components/
├── motion/Reveal.tsx              — new: scroll-reveal wrapper
├── ProductCard.tsx                 — rebuilt: motion + icons
├── StatusBadge.tsx                 — rebuilt: icons per status
├── Header.tsx                      — rebuilt: icons + animated mobile nav
├── Footer.tsx                      — rebuilt: icons + tighter copy
├── ImageGallery.tsx                — rebuilt: crossfade + camera icon
app/(site)/
├── page.tsx                        — full copy rewrite + motion + icons
├── browse/page.tsx
├── categories/page.tsx
├── listings/[slug]/page.tsx
├── about/page.tsx
├── contact/page.tsx
├── requests/page.tsx
├── error.tsx
app/
├── not-found.tsx
└── layout.tsx                      — tightened SEO title/description
```

Let me know if any section feels like it's animating too much or too
little — motion is easy to dial up or down once you've seen it live.
