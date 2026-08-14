import SubmitButton from "@/components/admin/SubmitButton";
import ImageUploader from "@/components/admin/ImageUploader";
import type { MerchCategory, MerchProduct } from "@/lib/types";
import styles from "./ListingForm.module.css";

const COLOR_SLOTS = 6;

export default function MerchProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: MerchCategory[];
  product?: MerchProduct;
}) {
  const colorSlots = Array.from(
    { length: COLOR_SLOTS },
    (_, i) => product?.colors[i] ?? { name: "", hex: "#14201b" }
  );

  return (
    <form action={action} className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Product details</h2>

        <label className={styles.label}>
          Name
          <input name="name" required defaultValue={product?.name} className={styles.input} placeholder="Hometown T-Shirt" />
        </label>

        <label className={styles.label}>
          URL slug (leave blank to auto-generate)
          <input name="slug" defaultValue={product?.slug} className={styles.input} placeholder="hometown-t-shirt" />
        </label>

        <label className={styles.label}>
          Description
          <textarea
            name="description"
            required
            defaultValue={product?.description}
            className={styles.textarea}
            rows={4}
            placeholder="Official Kimana Ndio Hometown t-shirt. Made for those who proudly represent our hometown."
          />
        </label>

        <div className={styles.row}>
          <label className={styles.label}>
            Price (KSh)
            <input name="price" type="number" min="0" required defaultValue={product?.price} className={styles.input} />
          </label>
          <label className={styles.label}>
            Category
            <select name="category_id" defaultValue={product?.category_id ?? ""} className={styles.select}>
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label className={styles.label}>
          Photos (first photo is the cover image)
          <ImageUploader initialImages={product?.images} />
        </label>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizes &amp; colors</h2>

        <label className={styles.label}>
          Available sizes (comma-separated)
          <input name="sizes" defaultValue={product?.sizes.join(", ")} className={styles.input} placeholder="S, M, L, XL, XXL" />
        </label>

        <div className={styles.label}>
          Available colors (leave name blank to skip a slot)
          {colorSlots.map((c, i) => (
            <div key={i} className={styles.row} style={{ marginTop: "var(--space-2)" }}>
              <input name="color_name" defaultValue={c.name} className={styles.input} placeholder={`Color ${i + 1} name (e.g. Black)`} />
              <input name="color_hex" type="color" defaultValue={c.hex || "#14201b"} className={styles.input} style={{ padding: 4, height: 44 }} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stock &amp; visibility</h2>

        <div className={styles.row}>
          <label className={styles.label}>
            Stock count
            <input name="stock_count" type="number" min="0" defaultValue={product?.stock_count ?? 0} className={styles.input} />
          </label>
          <label className={styles.label}>
            Status
            <select name="status" defaultValue={product?.status ?? "active"} className={styles.select}>
              <option value="active">Active (visible in store)</option>
              <option value="inactive">Hidden</option>
            </select>
          </label>
        </div>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="in_stock" defaultChecked={product?.in_stock ?? true} />
            In stock (available to order)
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="featured" defaultChecked={product?.featured} />
            Feature on Hometown Store home
          </label>
        </div>
      </section>

      <div className={styles.actions}>
        <SubmitButton>{product ? "Save changes" : "Create product"}</SubmitButton>
      </div>
    </form>
  );
}
