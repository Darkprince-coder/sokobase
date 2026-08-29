"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ImageOff, Sparkles, Tag, MessageCircle } from "lucide-react";
import styles from "./ProductCard.module.css";
import StatusBadge from "./StatusBadge";
import WhatsAppLink from "./WhatsAppLink";
import { formatPrice, discountPercent, inquireListingLink } from "@/lib/format";
import type { Listing } from "@/lib/types";

const SITE_URL = "https://sokobase.co.ke";

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
  const isSold = listing.status === "sold";
  const isOrderable = listing.status === "available";
  const soldLabel = isNew ? "Sold out" : "Sold";
  const discount = discountPercent(listing.price, listing.compare_at_price);
  const pageUrl = `${SITE_URL}/listings/${listing.slug}`;

  return (
    <motion.div
      className={styles.cardWrap}
      data-sold={isSold}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion || isSold ? undefined : { y: -4 }}
    >
      <div className={styles.card}>
        <Link href={`/listings/${listing.slug}`} className={styles.mediaLink}>
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

            {!isSold && listing.badge && (
              <div className={styles.merchBadgeWrap}>
                <span className={styles.merchBadge}>{listing.badge}</span>
              </div>
            )}

            {!isSold && (
              <div className={styles.badgeBottomLeft}>
                <StatusBadge status={listing.status} showLabel={false} />
              </div>
            )}

            {listing.verified && !isSold && (
              <div className={styles.badgeBottomRight}>
                <span className={styles.verified} title="Personally inspected" aria-label="Personally inspected">
                  <ShieldCheck size={13} strokeWidth={2.2} />
                </span>
              </div>
            )}

            {isSold && (
              <div className={styles.soldOverlay}>
                <span className={styles.soldOverlayText}>{soldLabel}</span>
              </div>
            )}
          </div>
        </Link>

        <div className={styles.body}>
          <div className={styles.priceRow}>
            <p className={`price-tag ${styles.price}`}>{formatPrice(listing.price)}</p>
            {discount !== null && !isSold && (
              <span className={styles.discountPill}>-{discount}%</span>
            )}
          </div>
          {listing.compare_at_price && discount !== null && !isSold && (
            <p className={styles.comparePrice}>{formatPrice(listing.compare_at_price)}</p>
          )}

          <Link href={`/listings/${listing.slug}`} className={styles.titleLink}>
            <h3 className={styles.title}>{listing.title}</h3>
          </Link>

          <div className={styles.meta}>
            {!isNew && <span>{listing.condition}</span>}
            {!isNew && <span aria-hidden="true">&middot;</span>}
            <span>{listing.location}</span>
          </div>
          {isNew && listing.merchant_name && (
            <p className={styles.merchant}>from {listing.merchant_name}</p>
          )}

          {isOrderable ? (
            <WhatsAppLink
              href={inquireListingLink(listing.title, pageUrl)}
              label={`card_${listing.slug}`}
              className={styles.orderButton}
            >
              <MessageCircle size={14} strokeWidth={2.2} />
              Order on WhatsApp
            </WhatsAppLink>
          ) : (
            <button type="button" disabled className={styles.orderButtonDisabled}>
              {listing.status === "reserved" ? "Reserved" : soldLabel}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
