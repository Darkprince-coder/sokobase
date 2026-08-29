"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Category, Condition, ListingType } from "@/lib/types";
import type { AdminListingDetail } from "@/lib/adminData";
import styles from "./ListingForm.module.css";

const CONDITIONS: Condition[] = ["New", "Like New", "Good", "Fair", "Needs Repair"];
const SPEC_SLOTS = 8;
const COLOR_SLOTS = 6;

export default function ListingFields({
  categories,
  listing,
}: {
  categories: Category[];
  listing?: AdminListingDetail;
}) {
  const [listingType, setListingType] = useState<ListingType>(
    listing?.listing_type ?? "secondhand"
  );
  const isNew = listingType === "new";

  const specSlots = Array.from(
    { length: SPEC_SLOTS },
    (_, i) => listing?.specs?.[i] ?? { label: "", value: "" }
  );
  const colorSlots = Array.from(
    { length: COLOR_SLOTS },
    (_, i) => listing?.colors?.[i] ?? { name: "", hex: "#14201b" }
  );

  return (
    <>
      <div className={styles.row}>
        <label
          className={styles.label}
          style={!isNew ? { gridColumn: "1 / -1" } : undefined}
        >
          Listing type
          <select
            name="listing_type"
            value={listingType}
            onChange={(e) => setListingType(e.target.value as ListingType)}
            className={styles.select}
          >
            <option value="secondhand">Secondhand</option>
            <option value="new">New item</option>
          </select>
        </label>

        {isNew && (
          <label className={styles.label}>
            Merchant / supplier name &mdash; optional
            <input
              name="merchant_name"
              defaultValue={listing?.merchant_name ?? ""}
              className={styles.input}
              placeholder="e.g. Kimana Hardware Ltd (leave blank if you'd rather not credit one)"
            />
          </label>
        )}
      </div>

      <label className={styles.label}>
        Title
        <input
          name="title"
          required
          defaultValue={listing?.title}
          className={styles.input}
          placeholder="Sony 12&quot; Woofer"
        />
      </label>

      <label className={styles.label}>
        URL slug (leave blank to auto-generate from title)
        <input
          name="slug"
          defaultValue={listing?.slug}
          className={styles.input}
          placeholder="sony-12-woofer"
        />
      </label>

      <label className={styles.label}>
        Description
        <textarea
          name="description"
          required
          defaultValue={listing?.description}
          className={styles.textarea}
          rows={4}
          placeholder="Condition details, defects, what's included..."
        />
      </label>

      <div className={styles.row}>
        <label
          className={styles.label}
          style={isNew ? { gridColumn: "1 / -1" } : undefined}
        >
          Price (KSh)
          <input
            name="price"
            type="number"
            min="0"
            required
            defaultValue={listing?.price}
            className={styles.input}
          />
        </label>

        {isNew ? (
          // New items are always in "New" condition — nothing for the
          // admin to pick, so the field is hidden and submitted for them.
          <input type="hidden" name="condition" value="New" />
        ) : (
          <label className={styles.label}>
            Condition
            <select
              name="condition"
              defaultValue={listing?.condition ?? "Good"}
              className={styles.select}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className={styles.row}>
        <label className={styles.label}>
          Old price (KSh) &mdash; optional
          <input
            name="compare_at_price"
            type="number"
            min="0"
            defaultValue={listing?.compare_at_price ?? ""}
            className={styles.input}
            placeholder="Leave blank if not discounted"
          />
        </label>
        <label className={styles.label}>
          Badge &mdash; optional
          <input
            name="badge"
            defaultValue={listing?.badge ?? ""}
            className={styles.input}
            placeholder="Hot Deal, Offer, Bestseller, Back in Stock..."
          />
        </label>
      </div>
      <p style={{ fontSize: "var(--text-xs)", color: "#6b756e", marginTop: "calc(var(--space-3) * -1)" }}>
        If you set an old price, the discount percentage is calculated and shown automatically &mdash;
        you don&rsquo;t need to type it yourself. The badge is separate from the automatic New/Secondhand
        tag and can say anything you like.
      </p>

      <div className={styles.row}>
        <label className={styles.label}>
          Category
          <select
            name="category_id"
            defaultValue={listing?.category_id ?? ""}
            className={styles.select}
          >
            <option value="">Uncategorized</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        {isNew ? (
          // Dropshipped items all ship from/around Kimana the same way, so
          // there's nothing item-specific for the admin to enter here.
          <input type="hidden" name="location" value="Kimana" />
        ) : (
          <label className={styles.label}>
            Location
            <input
              name="location"
              defaultValue={listing?.location ?? "Kimana"}
              className={styles.input}
            />
          </label>
        )}
      </div>

      {isNew && (
        <div className={styles.label}>
          Product specs &mdash; optional, shown as a spec sheet on the product page
          {specSlots.map((s, i) => (
            <div key={i} className={styles.row} style={{ marginTop: "var(--space-2)" }}>
              <input
                name="spec_label"
                defaultValue={s.label}
                className={styles.input}
                placeholder={`Spec ${i + 1} label (e.g. Battery)`}
              />
              <input
                name="spec_value"
                defaultValue={s.value}
                className={styles.input}
                placeholder="Value (e.g. Up to 7 days)"
              />
            </div>
          ))}
        </div>
      )}

      <label className={styles.label}>
        Available sizes &mdash; optional, comma-separated
        <input
          name="sizes"
          defaultValue={listing?.sizes?.join(", ") ?? ""}
          className={styles.input}
          placeholder="S, M, L, XL &mdash; leave blank if this item doesn't come in sizes"
        />
      </label>

      <div className={styles.label}>
        Available colors &mdash; optional, leave a slot&rsquo;s name blank to skip it
        {colorSlots.map((c, i) => (
          <div key={i} className={styles.row} style={{ marginTop: "var(--space-2)" }}>
            <input
              name="color_name"
              defaultValue={c.name}
              className={styles.input}
              placeholder={`Color ${i + 1} name (e.g. Black)`}
            />
            <input
              name="color_hex"
              type="color"
              defaultValue={c.hex || "#14201b"}
              className={styles.input}
              style={{ padding: 4, height: 44 }}
            />
          </div>
        ))}
      </div>

      <label className={styles.label}>
        Photos (first photo is the cover image)
        <ImageUploader initialImages={listing?.images} />
      </label>

      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="featured" defaultChecked={listing?.featured} />
          Feature on homepage
        </label>
        {!isNew && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="verified"
              defaultChecked={listing?.verified ?? true}
            />
            Personally inspected (verified)
          </label>
        )}
      </div>
      {isNew && <input type="hidden" name="verified" value="off" />}
    </>
  );
}
