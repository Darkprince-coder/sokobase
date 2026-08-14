"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
import { merchOrderLink } from "@/lib/format";
import type { MerchProduct } from "@/lib/types";
import styles from "./MerchOrderPanel.module.css";

export default function MerchOrderPanel({ product, pageUrl }: { product: MerchProduct; pageUrl: string }) {
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.colors[0]?.name ?? null);

  if (!product.in_stock) {
    return <div className={styles.soldOutNotice}>This item is currently sold out. Check back soon.</div>;
  }

  return (
    <div className={styles.panel}>
      {product.sizes.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>Select Size</span>
          <div className={styles.sizeRow}>
            {product.sizes.map((s) => (
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

      {product.colors.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>Select Color</span>
          <div className={styles.colorRow}>
            {product.colors.map((c) => (
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

      <WhatsAppLink
        href={merchOrderLink(product.name, size, color, product.price, pageUrl)}
        label={`merch_${product.slug}`}
        className={styles.orderButton}
      >
        <MessageCircle size={17} strokeWidth={2.2} />
        Order via WhatsApp
      </WhatsAppLink>
    </div>
  );
}
