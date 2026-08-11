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
              Hometown <span className={styles.wordmarkAccent}>SokoBase</span>
            </span>
          </div>
          <p className={styles.tagline}>Everything local. One place.</p>
          <p className={styles.copy}>Built in Kimana. Growing across the region.</p>
        </div>

        <div>
          <h3 className={styles.heading}>Explore</h3>
          <ul className={styles.list}>
            <li><Link href="/browse">Browse listings</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/rentals">Rentals</Link></li>
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

         <a
          href="https://mjelite.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#cfd8d1", marginLeft: 8, fontWeight: 600 }}
        >
          Built and maintained by MJ ELITE CREATIVES
        </a>
        <span>&copy; {new Date().getFullYear()} Hometown SokoBase. All rights reserved.</span>
        
       
      </div>
    </footer>
  );
}
