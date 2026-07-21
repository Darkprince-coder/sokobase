"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import styles from "./AdminNav.module.css";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/sales", label: "Commission" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link href="/admin" className={styles.brand}>
          <img src="/brand/logo-mark.svg" alt="" className={styles.mark} />
          <span>SokoBase Admin</span>
        </Link>

        <nav className={styles.nav}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link}
              data-active={pathname === link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <span className={styles.email}>{email}</span>
          <button onClick={handleLogout} className={styles.logout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
