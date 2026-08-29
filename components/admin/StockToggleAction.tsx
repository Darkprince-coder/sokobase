"use client";

import { useTransition } from "react";
import type { ListingStatus } from "@/lib/types";
import styles from "./ActionButtons.module.css";

// For "new" (dropshipped) items only — a plain sold-out / in-stock toggle
// with no commission step, since there's no seller payout to record for
// items you source from a supplier yourself. Secondhand items keep the
// existing StatusQuickAction + "Mark sold" (commission) flow.
export default function StockToggleAction({
  id,
  status,
  action,
}: {
  id: string;
  status: ListingStatus;
  action: (id: string, status: ListingStatus) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const isSoldOut = status === "sold";
  const nextStatus: ListingStatus = isSoldOut ? "available" : "sold";

  return (
    <button
      type="button"
      disabled={pending}
      className={styles.secondary}
      onClick={() => startTransition(() => action(id, nextStatus))}
    >
      {pending ? "Updating..." : isSoldOut ? "Mark in stock" : "Mark sold out"}
    </button>
  );
}
