"use client";

import { useTransition } from "react";
import type { RentalStatus } from "@/lib/types";
import styles from "./ActionButtons.module.css";

export default function RentalStatusAction({
  id,
  status,
  action,
}: {
  id: string;
  status: RentalStatus;
  action: (id: string, status: RentalStatus) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const nextStatus: RentalStatus = status === "available" ? "rented" : "available";
  const label = status === "available" ? "Mark rented" : "Mark available";

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
