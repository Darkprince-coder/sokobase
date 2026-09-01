"use client";

import { useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { usePWA } from "./PWAProvider";
import { AppOnly } from "./Visibility";
import styles from "./UpdateBanner.module.css";

export default function UpdateBanner() {
  const { updateAvailable, applyUpdate } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) return null;

  return (
    // Gated to the installed app only — website visitors just get the new
    // code on their next normal page load, no banner needed. Remove the
    // <AppOnly> wrapper if you'd rather show this on the website too.
    <AppOnly>
      <div className={styles.banner} role="status">
        <RefreshCw size={16} strokeWidth={2.2} className={styles.icon} />
        <span className={styles.text}>A new version of Hometown SokoBase is ready.</span>
        <div className={styles.actions}>
          <button type="button" className={styles.updateButton} onClick={applyUpdate}>
            Reload
          </button>
          <button
            type="button"
            className={styles.dismiss}
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </AppOnly>
  );
}
