import Link from "next/link";
import { getSales } from "@/lib/adminData";
import { updateCommission } from "@/lib/actions/sales";
import { formatPrice } from "@/lib/format";
import SubmitButton from "@/components/admin/SubmitButton";
import styles from "./sales.module.css";

export default async function AdminSalesPage() {
  const sales = await getSales();
  const totalCommission = sales.reduce((sum, s) => sum + (s.commission_amount ?? 0), 0);
  const totalPayout = sales.reduce((sum, s) => sum + s.seller_payout, 0);

  return (
    <div>
      <h1 className={styles.title}>Commission &amp; sales</h1>

      <div className={styles.summary}>
        <div>
          <span className={styles.summaryLabel}>Total commission earned</span>
          <p className="price-tag" style={{ fontSize: "var(--text-2xl)" }}>
            {formatPrice(totalCommission)}
          </p>
        </div>
        <div>
          <span className={styles.summaryLabel}>Total paid out to sellers</span>
          <p className="price-tag" style={{ fontSize: "var(--text-2xl)" }}>
            {formatPrice(totalPayout)}
          </p>
        </div>
      </div>

      {sales.length === 0 ? (
        <p className={styles.empty}>No sales recorded yet.</p>
      ) : (
        <div className={styles.list}>
          {sales.map((sale) => {
            const boundAction = updateCommission.bind(null, sale.id);
            return (
              <div key={sale.id} className={styles.row}>
                <div className={styles.rowHeader}>
                  <Link href={`/listings/${sale.listing?.slug}`} className={styles.itemTitle}>
                    {sale.listing?.title ?? "Deleted listing"}
                  </Link>
                  <span className={styles.date}>
                    {new Date(sale.sold_at).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className={styles.figures}>
                  <span>
                    Sold: <strong className="price-tag">{formatPrice(sale.sale_price)}</strong>
                  </span>
                  <span>
                    Payout:{" "}
                    <strong className="price-tag">{formatPrice(sale.seller_payout)}</strong>
                  </span>
                </div>

                <form action={boundAction} className={styles.commissionForm}>
                  <label className={styles.commissionLabel}>
                    Commission (KSh)
                    <input
                      type="number"
                      name="commission_amount"
                      min="0"
                      step="0.01"
                      defaultValue={sale.commission_amount ?? ""}
                      className={styles.commissionInput}
                    />
                  </label>
                  <SubmitButton>Save</SubmitButton>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
