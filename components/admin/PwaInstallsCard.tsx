import { getPwaInstallCount } from "@/lib/pwaInstalls";
import styles from "@/app/admin/(dashboard)/dashboard.module.css";

export default async function PwaInstallsCard() {
  const count = await getPwaInstallCount();

  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{count}</span>
      <span className={styles.statLabel}>App installs</span>
    </div>
  );
}
