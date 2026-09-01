import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import styles from "./CategoriesStrip.module.css";

// Server component — renders fine on both the plain website and the
// installed PWA, since /browse is now the PWA's start page and this is
// the natural place to surface categories at a glance ("shop by
// category" style, the way Kilimall/Jumia open their marketplace tab).
export default function CategoriesStrip({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div className={styles.row} aria-label="Shop by category">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/browse?category=${cat.slug}`} className={styles.chip}>
          {cat.name}
        </Link>
      ))}
      <Link href="/categories" className={styles.allChip}>
        All categories
        <ArrowRight size={13} strokeWidth={2.4} />
      </Link>
    </div>
  );
}
