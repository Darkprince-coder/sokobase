"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import styles from "./Header.module.css";
import { sellItemLink } from "@/lib/format";
import WhatsAppLink from "./WhatsAppLink";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/categories", label: "Categories" },
  { href: "/requests", label: "Requests" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <img src="/brand/logo-mark.svg" alt="" className={styles.mark} />
          <span className={styles.wordmark}>
            Soko<span className={styles.wordmarkAccent}>Base</span>
          </span>
        </Link>

        <nav className={styles.navDesktop} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <WhatsAppLink href={sellItemLink()} label="header_sell_button" className={styles.sellButton}>
            <MessageCircle size={15} strokeWidth={2.2} />
            Sell on SokoBase
          </WhatsAppLink>
          <button
            className={styles.menuToggle}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={styles.navMobile}
            aria-label="Primary mobile"
            style={{ overflow: "hidden" }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navMobileLink}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
