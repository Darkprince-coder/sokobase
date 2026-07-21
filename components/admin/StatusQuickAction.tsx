"use client";

import { useTransition } from "react";
import type { ListingStatus } from "@/lib/types";
import styles from "./ActionButtons.module.css";

export default function StatusQuickAction({
  id,
  status,
  action,
}: {
  id: string;
  status: ListingStatus;
  action: (id: string, status: ListingStatus) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const nextStatus: ListingStatus = status === "available" ? "reserved" : "available";
  const label =
    status === "available" ? "Mark reserved" : status === "reserved" ? "Mark available" : null;

  if (!label) return null;

  return (
    <button
      type="button"
      disabled={pending}
      className={styles.secondary}
      onClick={() => startTransition(() => action(id, nextStatus))}
    >
      {pending ? "Updating..." : label}
    </button>
  );
}
