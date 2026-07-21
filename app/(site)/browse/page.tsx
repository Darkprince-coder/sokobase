import type { Metadata } from "next";
import { SearchX, ListFilter } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCategories, getListings } from "@/lib/listings";
import styles from "./browse.module.css";

export const metadata: Metadata = {
  title: "Browse Listings",
  description:
    "Browse verified second-hand items for sale in Kimana. Every listing is personally inspected before it goes live.",
};

export const revalidate = 30; // Revalidate cached data every 30 seconds

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Needs Repair"];

interface BrowsePageProps {
  searchParams: {
    q?: string;
    category?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { q, category, condition, minPrice, maxPrice, sort } = searchParams;

  const [categories, listings] = await Promise.all([
    getCategories(),
    getListings({
      q,
      category,
      condition,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: (sort as "newest" | "price_asc" | "price_desc") || "newest",
    }),
  ]);

  return (
    <main className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>All listings</h1>
        <p className={styles.subtitle}>
          {listings.length} item{listings.length === 1 ? "" : "s"} &middot; every one personally inspected
        </p>
      </div>

      <form method="get" className={styles.filters}>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search listings..."
          className={styles.filterInput}
        />

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
    </main>
  );
}
