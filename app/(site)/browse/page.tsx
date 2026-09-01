import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, ListFilter, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import HeroBackground from "@/components/HeroBackground";
// NEW — PWA
import CategoriesStrip from "@/components/pwa/CategoriesStrip";
import { getCategories, getListings } from "@/lib/listings";
import styles from "./browse.module.css";

export const metadata: Metadata = {
  title: "Browse Listings",
  description:
    "Browse secondhand and new items for sale in Kimana. Every listing personally inspected or sourced from a trusted supplier.",
};

export const revalidate = 30; // Revalidate cached data every 30 seconds

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Needs Repair"];

// Set this once you have a real photo — e.g. "/browse-hero.jpg" after
// adding the file to /public/. Leave the default filename in place (or
// set the env var) and the hero falls back to a plain gradient
// automatically if the image is missing — see HeroBackground.tsx.
const BROWSE_HERO_IMAGE = process.env.NEXT_PUBLIC_BROWSE_HERO_IMAGE_URL || "/browse-hero.jpg";

interface BrowsePageProps {
  searchParams: {
    q?: string;
    category?: string;
    condition?: string;
    type?: string; // "secondhand" | "new"
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { q, category, condition, type, minPrice, maxPrice, sort } = searchParams;

  const [categories, listings] = await Promise.all([
    getCategories(),
    getListings({
      q,
      category,
      condition,
      type: type === "secondhand" || type === "new" ? type : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: (sort as "newest" | "price_asc" | "price_desc") || "newest",
    }),
  ]);

  const tabs = [
    { value: undefined, label: "All" },
    { value: "secondhand", label: "Secondhand" },
    { value: "new", label: "New items" },
  ];

  return (
    <main>
      <section className={styles.hero}>
        <HeroBackground src={BROWSE_HERO_IMAGE} />
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.heroTitle}>Shop With Us</h1>
          <p className={styles.heroSubtitle}>
            {/* {listings.length} item{listings.length === 1 ? "" : "s"} &middot; */} new goods and
            secondhand finds, all in one place
          </p>

          <form method="get" className={styles.heroSearch}>
            {type && <input type="hidden" name="type" value={type} />}
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search phones, furniture, appliances..."
              className={styles.heroSearchInput}
              aria-label="Search listings"
            />
            <button type="submit" className={styles.heroSearchButton}>
              <Search size={16} strokeWidth={2.2} />
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="container">
        {/* NEW — quick category links, mainly for the PWA's "Products"
            tab, but useful on the website too. */}
        <CategoriesStrip categories={categories} />

        <div className={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = (type ?? undefined) === tab.value;
            const href = tab.value ? `/browse?type=${tab.value}` : "/browse";
            return (
              <Link
                key={tab.label}
                href={href}
                className={isActive ? styles.tabActive : styles.tab}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <form method="get" className={styles.filters}>
          {type && <input type="hidden" name="type" value={type} />}
          {q && <input type="hidden" name="q" value={q} />}

          <select name="category" defaultValue={category ?? ""} className={styles.filterSelect}>
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select name="condition" defaultValue={condition ?? ""} className={styles.filterSelect}>
            <option value="">Any condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            defaultValue={minPrice}
            placeholder="Min KSh"
            className={styles.filterInputSmall}
          />
          <input
            type="number"
            name="maxPrice"
            defaultValue={maxPrice}
            placeholder="Max KSh"
            className={styles.filterInputSmall}
          />

          <select name="sort" defaultValue={sort ?? "newest"} className={styles.filterSelect}>
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>

          <button type="submit" className={styles.filterButton}>
            <ListFilter size={15} strokeWidth={2.2} />
            Apply
          </button>
        </form>

        {listings.length > 0 ? (
          <div className={styles.grid}>
            {listings.map((listing, i) => (
              <ProductCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <SearchX size={28} strokeWidth={1.5} />
            <p>Nothing matches those filters yet. Try widening your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
