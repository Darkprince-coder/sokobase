"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Home as HomeIcon, Store, MessageCircle, Plus } from "lucide-react";
import { usePWA } from "./PWAProvider";
import ListWithUsSheet from "./ListWithUsSheet";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  const { isStandalone } = usePWA();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Only ever shown for the installed app — the normal website is
  // untouched, exactly as on desktop or a plain mobile browser tab.
  if (!isStandalone) return null;

  return (
    <>
      {/* Static spacer so page content (and the real Footer) never sits
          underneath the fixed nav below it. */}
      <div className={styles.spacer} aria-hidden="true" />

      <nav className={styles.nav} aria-label="App navigation">
        <Link href="/browse" className={styles.item} data-active={pathname.startsWith("/browse")}>
          <ShoppingBag size={20} strokeWidth={2} />
          <span>Products</span>
        </Link>

        <Link href="/rentals" className={styles.item} data-active={pathname.startsWith("/rentals")}>
          <HomeIcon size={20} strokeWidth={2} />
          <span>Rentals</span>
        </Link>

        <button
          type="button"
          className={styles.centerButton}
          onClick={() => setSheetOpen(true)}
          aria-label="List with us"
        >
          <Plus size={22} strokeWidth={2.6} />
          <span>List</span>
        </button>

        <Link href="/store" className={styles.item} data-active={pathname.startsWith("/store")}>
          <Store size={20} strokeWidth={2} />
          <span>Store</span>
        </Link>

        <Link href="/contact" className={styles.item} data-active={pathname.startsWith("/contact")}>
          <MessageCircle size={20} strokeWidth={2} />
          <span>Contact</span>
        </Link>
      </nav>

      <ListWithUsSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
