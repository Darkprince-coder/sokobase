import Link from "next/link";
import { getDashboardStats } from "@/lib/adminData";
import { formatPrice } from "@/lib/format";
import styles from "./dashboard.module.css";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <Link href="/admin/listings/new" className={styles.newButton}>
          + New listing
        </Link>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total listings</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.available}</span>
          <span className={styles.statLabel}>Available</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.reserved}</span>
          <span className={styles.statLabel}>Reserved</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.sold}</span>
          <span className={styles.statLabel}>Sold</span>
        </div>
      </div>

      <div className={styles.commissionCard}>
        <div>
          <span className={styles.commissionLabel}>Total commission earned</span>
          <p className={styles.commissionValue}>{formatPrice(stats.totalCommission)}</p>
        </div>
        {stats.pendingCommission > 0 && (
          <Link href="/admin/sales" className={styles.commissionAlert}>
            {stats.pendingCommission} sale{stats.pendingCommission === 1 ? "" : "s"} still need
            a commission entered &rarr;
          </Link>
        )}
        {stats.openRequests > 0 && (
          <Link href="/admin/requests" className={styles.commissionAlert}>
            {stats.openRequests} open request{stats.openRequests === 1 ? "" : "s"} waiting
            &rarr;
          </Link>
        )}
      </div>

      <div className={styles.recent}>
        <div className={styles.recentHeader}>
          <h2 className={styles.sectionTitle}>Recent sales</h2>
          <Link href="/admin/sales" className={styles.link}>
            View all &rarr;
          </Link>
        </div>

        {stats.recentSales.length > 0 ? (
          <ul className={styles.recentList}>
            {stats.recentSales.map((sale) => (
              <li key={sale.id} className={styles.recentItem}>
                <span>{sale.listing?.title ?? "Deleted listing"}</span>
                <span className="price-tag">{formatPrice(sale.sale_price)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No sales recorded yet.</p>
        )}
      </div>
    </div>
  );
}
