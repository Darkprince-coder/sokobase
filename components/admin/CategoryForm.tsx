import SubmitButton from "@/components/admin/SubmitButton";
import type { Category } from "@/lib/types";
import styles from "./ListingForm.module.css";

export default function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => Promise<void>;
  category?: Category;
}) {
  return (
    <form action={action} className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Category details</h2>

        <label className={styles.label}>
          Name
          <input
            name="name"
            required
            defaultValue={category?.name}
            className={styles.input}
            placeholder="e.g. Electronics"
          />
        </label>

        <label className={styles.label}>
          URL slug (leave blank to auto-generate from name)
          <input
            name="slug"
            defaultValue={category?.slug}
            className={styles.input}
            placeholder="electronics"
          />
        </label>

        <label className={styles.label}>
          Icon name &mdash; optional (for future use, e.g. a Lucide icon name)
          <input
            name="icon"
            defaultValue={category?.icon ?? ""}
            className={styles.input}
            placeholder="e.g. laptop"
          />
        </label>

        <label className={styles.label}>
          Sort order
          <input
            name="sort_order"
            type="number"
            defaultValue={category?.sort_order ?? 0}
            className={styles.input}
            placeholder="Lower numbers show first"
          />
        </label>
      </section>

      <div className={styles.actions}>
        <SubmitButton>{category ? "Save changes" : "Add category"}</SubmitButton>
      </div>
    </form>
  );
}
