import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, MapPinned } from "lucide-react";
import MerchProductCard from "@/components/store/MerchProductCard";
import Reveal from "@/components/motion/Reveal";
import { getMerchCategories, getFeaturedMerch, getMerchProductCount } from "@/lib/merch";
import styles from "./store.module.css";

export const metadata: Metadata = {
  title: "Hometown Store",
  description: "Official Kimana Ndio Hometown merchandise — shirts, hoodies, caps and more.",
};

export const revalidate = 60;

export default async function HometownStorePage() {
  const [categories, featured, productCount] = await Promise.all([
    getMerchCategories(),
    getFeaturedMerch(8),
    getMerchProductCount(),
  ]);

  return (
    <main className="container">
      <Reveal className={styles.hero}>
        <span className={styles.eyebrow}>Kimana Ndio Hometown Official Merchandise</span>
        <h1 className={styles.title}>Hometown Store</h1>
        <p className={styles.subtitle}>Wear your hometown. Represent with pride.</p>
        <div className={styles.heroActions}>
          <Link href="/store/products" className={styles.shopButton}>
            Shop all products <ArrowRight size={15} strokeWidth={2.4} />
          </Link>
          <span className={styles.countBadge}>{productCount} products</span>
        </div>
      </Reveal>

      {categories.length > 0 && (
        <section className={styles.section}>
          <Reveal>
            <h2 className={styles.sectionTitle}>Shop by category</h2>
            <div className={styles.categoryRow}>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/store/products?category=${cat.slug}`} className={styles.categoryChip}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      <section className={styles.section}>
        <Reveal className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Featured</h2>
          <Link href="/store/products" className={styles.sectionLink}>
            View all <ArrowRight size={14} strokeWidth={2.4} />
          </Link>
        </Reveal>
        {featured.length > 0 ? (
          <div className={styles.grid}>
            {featured.map((p, i) => (
              <MerchProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Add a featured product from the admin dashboard.</p>
        )}
      </section>

      <section className={`${styles.section} ${styles.trustSection}`}>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <ShieldCheck size={20} strokeWidth={1.8} className={styles.trustIcon} />
            <span>Official merchandise</span>
          </div>
          <div className={styles.trustItem}>
            <CheckCircle2 size={20} strokeWidth={1.8} className={styles.trustIcon} />
            <span>Quality checked</span>
          </div>
          <div className={styles.trustItem}>
            <MapPinned size={20} strokeWidth={1.8} className={styles.trustIcon} />
            <span>Pick up in Kimana</span>
          </div>
        </div>
      </section>
    </main>
  );
}
