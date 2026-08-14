import type { Metadata } from "next";
import { SearchX, ListFilter } from "lucide-react";
import MerchProductCard from "@/components/store/MerchProductCard";
import { getMerchCategories, getMerchProducts } from "@/lib/merch";
import browseStyles from "@/app/(site)/browse/browse.module.css";

export const metadata: Metadata = { title: "All Products — Hometown Store" };

interface Props {
  searchParams: { q?: string; category?: string; sort?: string };
}

export default async function StoreProductsPage({ searchParams }: Props) {
  const { q, category, sort } = searchParams;
  const [categories, products] = await Promise.all([
    getMerchCategories(),
    getMerchProducts({ q, category, sort: (sort as "newest" | "price_asc" | "price_desc") || "newest" }),
  ]);

  return (
    <main className="container">
      <div className={browseStyles.header}>
        <h1 className={browseStyles.title}>All Products</h1>
        <p className={browseStyles.subtitle}>
          {products.length} item{products.length === 1 ? "" : "s"} &middot; Hometown Store
        </p>
      </div>

      <form method="get" className={browseStyles.filters}>
        <input type="text" name="q" defaultValue={q} placeholder="Search products..." className={browseStyles.filterInput} />
        <select name="category" defaultValue={category ?? ""} className={browseStyles.filterSelect}>
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort ?? "newest"} className={browseStyles.filterSelect}>
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <button type="submit" className={browseStyles.filterButton}>
          <ListFilter size={15} strokeWidth={2.2} /> Apply
        </button>
      </form>

      {products.length > 0 ? (
        <div className={browseStyles.grid}>
          {products.map((p, i) => (
            <MerchProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className={browseStyles.empty}>
          <SearchX size={28} strokeWidth={1.5} />
          <p>Nothing matches yet. Try a different search or category.</p>
        </div>
      )}
    </main>
  );
}
