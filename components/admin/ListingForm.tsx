import SubmitButton from "@/components/admin/SubmitButton";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Category } from "@/lib/types";
import type { AdminListingDetail } from "@/lib/adminData";
import styles from "./ListingForm.module.css";

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Needs Repair"];

export default function ListingForm({
  action,
  categories,
  listing,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  listing?: AdminListingDetail;
}) {
  return (
    <form action={action} className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Listing details</h2>

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
          <label className={styles.label}>
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
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Seller details (private &mdash; never shown publicly)</h2>

        <div className={styles.row}>
          <label className={styles.label}>
            Seller name
            <input
              name="seller_name"
              defaultValue={listing?.listing_private?.seller_name}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Seller phone
            <input
              name="seller_phone"
              defaultValue={listing?.listing_private?.seller_phone}
              className={styles.input}
              placeholder="0712 345 678"
            />
          </label>
        </div>

        <label className={styles.label}>
          Intake date
          <input
            name="intake_date"
            type="date"
            defaultValue={listing?.listing_private?.intake_date ?? ""}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Intake / condition notes
          <textarea
            name="intake_notes"
            defaultValue={listing?.listing_private?.intake_notes ?? ""}
            className={styles.textarea}
            rows={3}
            placeholder="Scratches on left corner, tested and working, missing remote..."
          />
        </label>
      </section>

      <div className={styles.actions}>
        <SubmitButton>{listing ? "Save changes" : "Create listing"}</SubmitButton>
      </div>
    </form>
  );
}
