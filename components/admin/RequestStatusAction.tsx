"use client";

import { useTransition } from "react";
import styles from "./ActionButtons.module.css";

export default function RequestStatusAction({
  id,
  status,
  onFulfill,
  onReopen,
}: {
  id: string;
  status: "open" | "fulfilled";
  onFulfill: (id: string) => Promise<void>;
  onReopen: (id: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  if (status === "open") {
    return (
      <button
        type="button"
        disabled={pending}
        className={styles.secondary}
        onClick={() => startTransition(() => onFulfill(id))}
      >
        {pending ? "Updating..." : "Mark fulfilled"}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      className={styles.secondary}
      onClick={() => startTransition(() => onReopen(id))}
    >
      {pending ? "Updating..." : "Reopen"}
    </button>
  );
}
