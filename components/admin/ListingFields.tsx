"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Category, Condition, ListingType } from "@/lib/types";
import type { AdminListingDetail } from "@/lib/adminData";
import styles from "./ListingForm.module.css";

const CONDITIONS: Condition[] = ["New", "Like New", "Good", "Fair", "Needs Repair"];

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

        <label className={styles.label}>
          Location
          <input
            name="location"
            defaultValue={listing?.location ?? "Kimana"}
            className={styles.input}
          />
        </label>
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
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="verified"
            defaultChecked={listing?.verified ?? true}
          />
          Personally inspected (verified)
        </label>
      </div>
    </>
  );
}
