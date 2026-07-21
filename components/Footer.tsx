import Link from "next/link";
import { ShieldCheck, MapPinned, Tag, HandCoins } from "lucide-react";
import styles from "./Footer.module.css";

const TRUST_ITEMS = [
  { icon: ShieldCheck, text: "Every item inspected" },
  { icon: MapPinned, text: "Safe office meet-ups" },
  { icon: Tag, text: "Transparent pricing" },
  { icon: HandCoins, text: "Fair seller commissions" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <div className={styles.brand}>
            <img src="/brand/logo-mark.svg" alt="" className={styles.mark} />
            <span className={styles.wordmark}>
              Soko<span className={styles.wordmarkAccent}>Base</span>
            </span>
          </div>
          <p className={styles.tagline}>Everything local. One place.</p>
          <p className={styles.copy}>Live in Kimana. Growing across Kajiado.</p>
        </div>

        <div>
          <h3 className={styles.heading}>Explore</h3>
          <ul className={styles.list}>
            <li><Link href="/browse">Browse listings</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/requests">Client requests</Link></li>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/contact">Contact &amp; office</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={styles.heading}>Trust</h3>
          <ul className={styles.list}>
            {TRUST_ITEMS.map(({ icon: Icon, text }) => (
              <li key={text} className={styles.trustItem}>
                <Icon size={15} strokeWidth={2} />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>&copy; {new Date().getFullYear()} SokoBase. All rights reserved.</span>
      </div>
    </footer>
  );
}
