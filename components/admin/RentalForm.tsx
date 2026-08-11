import SubmitButton from "@/components/admin/SubmitButton";
import ImageUploader from "@/components/admin/ImageUploader";
import type { AdminRentalDetail } from "@/lib/adminRentalsData";
import styles from "@/components/admin/ListingForm.module.css";

const HOUSE_TYPES = [
  "Single Room",
  "Bedsitter",
  "1 Bedroom",
  "2 Bedroom",
  "3 Bedroom+",
  "Shop",
  "Office",
  "Warehouse",
  "Commercial Plot",
  "Other",
];

export default function RentalForm({
  action,
  rental,
}: {
  action: (formData: FormData) => Promise<void>;
  rental?: AdminRentalDetail;
}) {
  return (
    <form action={action} className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Property details</h2>

        <label className={styles.label}>
          Title
          <input
            name="title"
            required
            defaultValue={rental?.title}
            className={styles.input}
            placeholder="Cozy 1 Bedroom near Kimana Town"
          />
        </label>

        <label className={styles.label}>
          URL slug (leave blank to auto-generate from title)
          <input
            name="slug"
            defaultValue={rental?.slug}
            className={styles.input}
            placeholder="cozy-1-bedroom-near-kimana-town"
          />
        </label>

        <label className={styles.label}>
          Description
          <textarea
            name="description"
            required
            defaultValue={rental?.description}
            className={styles.textarea}
            rows={4}
            placeholder="Anything a tenant should know: parking, security, condition, neighbours..."
          />
        </label>

        <div className={styles.row}>
          <label className={styles.label}>
            Monthly rent (KSh)
            <input
              name="monthly_rent"
              type="number"
              min="0"
              required
              defaultValue={rental?.monthly_rent}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Deposit (KSh) &mdash; optional
            <input
              name="deposit"
              type="number"
              min="0"
              defaultValue={rental?.deposit ?? ""}
              className={styles.input}
              placeholder="Leave blank if none required"
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            Listing category
            <select
              name="rental_category"
              defaultValue={rental?.rental_category ?? "residential"}
              className={styles.select}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial / Business</option>
            </select>
          </label>

          <label className={styles.label}>
            Property type
            <select
              name="house_type"
              defaultValue={rental?.house_type ?? "Bedsitter"}
              className={styles.select}
            >
              {HOUSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            Location
            <input
              name="location"
              defaultValue={rental?.location ?? "Kimana"}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Distance to town &mdash; optional
            <input
              name="distance_to_town"
              defaultValue={rental?.distance_to_town ?? ""}
              className={styles.input}
              placeholder="e.g. 5 min boda ride, 2km"
            />
          </label>
        </div>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="has_electricity"
              defaultChecked={rental?.has_electricity ?? true}
            />
            Has electricity
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="has_water" defaultChecked={rental?.has_water ?? true} />
            Has running water
          </label>
        </div>

        <label className={styles.label}>
          Photos (first photo is the cover image)
          <ImageUploader initialImages={rental?.images} />
        </label>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="featured" defaultChecked={rental?.featured} />
            Feature on homepage
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="verified"
              defaultChecked={rental?.verified ?? true}
            />
            Personally inspected (verified)
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Owner details (private &mdash; never shown publicly)</h2>

        <div className={styles.row}>
          <label className={styles.label}>
            Owner name
            <input
              name="landlord_name"
              defaultValue={rental?.rental_contact?.landlord_name}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Owner phone
            <input
              name="landlord_phone"
              defaultValue={rental?.rental_contact?.landlord_phone}
              className={styles.input}
              placeholder="0712 345 678"
            />
          </label>
        </div>

        <label className={styles.label}>
          Intake notes
          <textarea
            name="intake_notes"
            defaultValue={rental?.rental_contact?.intake_notes ?? ""}
            className={styles.textarea}
            rows={3}
            placeholder="Anything relevant from the owner conversation"
          />
        </label>
      </section>

      <div className={styles.actions}>
        <SubmitButton>{rental ? "Save changes" : "Add rental"}</SubmitButton>
      </div>
    </form>
  );
}
