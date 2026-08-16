import SubmitButton from "@/components/admin/SubmitButton";
import ListingFields from "@/components/admin/ListingFields";
import type { Category } from "@/lib/types";
import type { AdminListingDetail } from "@/lib/adminData";
import styles from "./ListingForm.module.css";

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
        <ListingFields categories={categories} listing={listing} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Seller details (private &mdash; never shown publicly)</h2>
        <p style={{ fontSize: "var(--text-sm)", color: "#6b756e", marginTop: "calc(var(--space-2) * -1)" }}>
          For new items sourced from a merchant, you can leave this section blank and use the
          merchant name field above instead.
        </p>

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
