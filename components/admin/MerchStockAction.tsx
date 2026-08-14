"use client";

import { useTransition } from "react";
import styles from "./ActionButtons.module.css";

export default function MerchStockAction({
  id,
  inStock,
  action,
}: {
  id: string;
  inStock: boolean;
  action: (id: string, inStock: boolean) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={styles.secondary}
      onClick={() => startTransition(() => action(id, !inStock))}
    >
      {pending ? "Updating..." : inStock ? "Mark sold out" : "Mark in stock"}
    </button>
  );
}
