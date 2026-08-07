"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ImageOff, Zap, Droplet, MapPin } from "lucide-react";
import styles from "./RentalCard.module.css";
import { formatPrice } from "@/lib/format";
import type { Rental } from "@/lib/types";

export default function RentalCard({
  rental,
  index = 0,
}: {
  rental: Rental;
  index?: number;
}) {
  const cover = rental.images?.[0];
  const shouldReduceMotion = useReducedMotion();
  const isRented = rental.status === "rented";

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
    >
      <Link href={`/rentals/${rental.slug}`} className={styles.card}>
        <div className={styles.imageWrap}>
          {cover ? (
            <img src={cover} alt={rental.title} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={20} strokeWidth={1.5} />
              <span>No photo yet</span>
            </div>
          )}
          <div className={styles.badgeRow}>
            <span className={isRented ? styles.statusRented : styles.statusAvailable}>
              {isRented ? "Rented" : "Available"}
            </span>
            {rental.verified && (
              <span className={styles.verified} title="Personally inspected">
                <ShieldCheck size={13} strokeWidth={2.2} />
                Verified
              </span>
            )}
          </div>
        </div>

        <div className={styles.body}>
          <p className={`price-tag ${styles.price}`}>
            {formatPrice(rental.monthly_rent)}
            <span className={styles.perMonth}>/mo</span>
          </p>
          <h3 className={styles.title}>{rental.title}</h3>
          <div className={styles.meta}>
            <span>{rental.house_type}</span>
            <span aria-hidden="true">&middot;</span>
            <span className={styles.metaLocation}>
              <MapPin size={12} strokeWidth={2} />
              {rental.location}
            </span>
          </div>
          <div className={styles.utilities}>
            {rental.has_electricity && (
              <span className={styles.utility}>
                <Zap size={12} strokeWidth={2} /> Power
              </span>
            )}
            {rental.has_water && (
              <span className={styles.utility}>
                <Droplet size={12} strokeWidth={2} /> Water
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
