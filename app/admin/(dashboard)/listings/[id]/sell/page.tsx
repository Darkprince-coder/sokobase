import { notFound } from "next/navigation";
import { getAdminListing } from "@/lib/adminData";
import { markSold } from "@/lib/actions/sales";
import SubmitButton from "@/components/admin/SubmitButton";
import { formatPrice } from "@/lib/format";
import formStyles from "@/components/admin/ListingForm.module.css";
import styles from "./sell.module.css";

export default async function MarkSoldPage({ params }: { params: { id: string } }) {
  const listing = await getAdminListing(params.id);
  if (!listing) notFound();

  const boundAction = markSold.bind(null, params.id);

  return (
    <div>
      <h1 className={styles.title}>Mark &ldquo;{listing.title}&rdquo; as sold</h1>
      <p className={styles.listedPrice}>
        Listed at <span className="price-tag">{formatPrice(listing.price)}</span>
      </p>

      <form action={boundAction} className={formStyles.form}>
        <section className={formStyles.section}>
          <label className={formStyles.label}>
            Final sale price (KSh)
            <input
              name="sale_price"
              type="number"
              min="0"
              required
              defaultValue={listing.price}
              className={formStyles.input}
            />
          </label>

          <label className={formStyles.label}>
            Commission amount (KSh)
            <input
              name="commission_amount"
              type="number"
              min="0"
              step="0.01"
              className={formStyles.input}
              placeholder="Enter once agreed &mdash; can be filled in later"
            />
          </label>

          <label className={formStyles.label}>
            Notes (optional)
            <textarea
              name="notes"
              rows={2}
              className={formStyles.textarea}
              placeholder="Any notes about this sale"
            />
          </label>
        </section>

        <div className={formStyles.actions}>
          <SubmitButton>Confirm sold</SubmitButton>
        </div>
      </form>
    </div>
  );
}
