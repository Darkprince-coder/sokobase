"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ImageOff, Sparkles, Tag } from "lucide-react";
import styles from "./ProductCard.module.css";
import StatusBadge from "./StatusBadge";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export default function ProductCard({
  listing,
  index = 0,
}: {
  listing: Listing;
  index?: number;
}) {
  const cover = listing.images?.[0];
  const shouldReduceMotion = useReducedMotion();
  const isNew = listing.listing_type === "new";

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
    >
      <Link href={`/listings/${listing.slug}`} className={styles.card}>
        <div className={styles.imageWrap}>
          {cover ? (
            <img src={cover} alt={listing.title} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={20} strokeWidth={1.5} />
              <span>No photo yet</span>
            </div>
          )}
          <div className={styles.badgeRow}>
            {isNew ? (
              <span className={styles.newTag}>
                <Sparkles size={12} strokeWidth={2.4} />
                New
              </span>
            ) : (
              <span className={styles.secondhandTag}>
                <Tag size={12} strokeWidth={2.4} />
                Secondhand
              </span>
            )}
          </div>
          <div className={styles.badgeBottomLeft}>
            <StatusBadge status={listing.status} showLabel={false} />
          </div>
          {listing.verified && (
            <div className={styles.badgeBottomRight}>
              <span className={styles.verified} title="Personally inspected" aria-label="Personally inspected">
                <ShieldCheck size={13} strokeWidth={2.2} />
              </span>
            </div>
          )}
        </div>

        <div className={styles.body}>
          <p className={`price-tag ${styles.price}`}>{formatPrice(listing.price)}</p>
          <h3 className={styles.title}>{listing.title}</h3>
          <div className={styles.meta}>
            {/* Condition is only meaningful for secondhand items — new
                items are always "New", which the tag above already says. */}
            {!isNew && <span>{listing.condition}</span>}
            {!isNew && <span aria-hidden="true">&middot;</span>}
            <span>{listing.location}</span>
          </div>
          {isNew && listing.merchant_name && (
            <p className={styles.merchant}>from {listing.merchant_name}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
