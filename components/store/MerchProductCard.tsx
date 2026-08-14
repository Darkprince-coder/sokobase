"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ImageOff } from "lucide-react";
import styles from "./MerchProductCard.module.css";
import { formatPrice } from "@/lib/format";
import type { MerchProduct } from "@/lib/types";

export default function MerchProductCard({ product, index = 0 }: { product: MerchProduct; index?: number }) {
  const cover = product.images?.[0];
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04 }}
    >
      <Link href={`/store/products/${product.slug}`} className={styles.card}>
        <div className={styles.imageWrap}>
          {cover ? (
            <img src={cover} alt={product.name} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={20} strokeWidth={1.5} />
              <span>No photo yet</span>
            </div>
          )}
          {!product.in_stock && <span className={styles.soldOut}>Sold out</span>}
        </div>
        <div className={styles.body}>
          <p className={`price-tag ${styles.price}`}>{formatPrice(product.price)}</p>
          <h3 className={styles.title}>{product.name}</h3>
          {product.sizes.length > 0 && <p className={styles.meta}>{product.sizes.join(" · ")}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
