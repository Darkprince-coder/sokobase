import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/listings";
import Reveal from "@/components/motion/Reveal";
import styles from "./categories.module.css";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse SokoBase listings by category.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <p className={styles.subtitle}>Find what you need, faster.</p>
      </div>

      <div className={styles.grid}>
        {categories.map((cat, i) => (
          <Reveal key={cat.id} delay={Math.min(i, 6) * 0.04}>
            <Link href={`/browse?category=${cat.slug}`} className={styles.card}>
              <span className={styles.name}>{cat.name}</span>
              <ArrowRight size={18} strokeWidth={2.2} className={styles.arrow} />
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
