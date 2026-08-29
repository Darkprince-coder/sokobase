"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
import { inquireListingLink } from "@/lib/format";
import type { Listing } from "@/lib/types";
import styles from "./ListingOrderPanel.module.css";

export default function ListingOrderPanel({
  listing,
  pageUrl,
}: {
  listing: Listing;
  pageUrl: string;
}) {
  const [size, setSize] = useState<string | null>(listing.sizes?.[0] ?? null);
  const [color, setColor] = useState<string | null>(listing.colors?.[0]?.name ?? null);
  const isNew = listing.listing_type === "new";

  if (listing.status === "sold") {
    return (
      <div className={styles.unavailable}>
        This item has been {isNew ? "sold out" : "sold"}. Check{" "}
        <a href="/browse">other listings</a>.
      </div>
    );
  }

  if (listing.status === "reserved") {
    return (
      <div className={styles.unavailable}>
        This item is reserved right now. Check <a href="/browse">other listings</a>.
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {listing.sizes.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>Select Size</span>
          <div className={styles.sizeRow}>
            {listing.sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={styles.sizeButton}
                data-active={s === size}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {listing.colors.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>Select Color</span>
          <div className={styles.colorRow}>
            {listing.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                className={styles.colorSwatch}
                data-active={c.name === color}
                style={{ background: c.hex }}
                title={c.name}
                aria-label={c.name}
                onClick={() => setColor(c.name)}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.stickyBar}>
        <WhatsAppLink
          href={inquireListingLink(listing.title, pageUrl, size, color)}
          label={`listing_${listing.slug}`}
          className={styles.cta}
        >
          <MessageCircle size={17} strokeWidth={2.2} />
          Chat to buy on WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
