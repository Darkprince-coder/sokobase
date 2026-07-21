"use client";

import { useFormStatus } from "react-dom";
import styles from "./ActionButtons.module.css";

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={styles.primary}>
      {pending ? "Saving..." : children}
    </button>
  );
}
