"use client";

import { useTransition } from "react";
import styles from "./ActionButtons.module.css";

export default function DeleteListingButton({
  id,
  title,
  action,
}: {
  id: string;
  title: string;
  action: (id: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className={styles.danger}
      onClick={() => {
        if (window.confirm(`Delete "${title}"? This can't be undone.`)) {
          startTransition(() => action(id));
        }
      }}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
