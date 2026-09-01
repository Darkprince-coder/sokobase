"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { usePWA, PWA_INSTALLED_KEY } from "./PWAProvider";
import styles from "./InstallPrompt.module.css";

// sessionStorage (not localStorage) is the whole trick here: a dismissal
// only lasts for the current browser session/tab. Close the tab or come
// back tomorrow and, if the app still isn't installed, the banner is back.
const SESSION_DISMISS_KEY = "sokobase_pwa_prompt_dismissed";

export default function InstallPrompt() {
  const { isStandalone, isIOS, canInstall, promptInstall } = usePWA();
  const [hidden, setHidden] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const alreadyInstalled = window.localStorage.getItem(PWA_INSTALLED_KEY) === "1";
      const dismissedThisSession = window.sessionStorage.getItem(SESSION_DISMISS_KEY) === "1";
      setHidden(alreadyInstalled || dismissedThisSession);
    } catch {
      setHidden(false);
    }
  }, []);

  // Nothing to show: not mounted yet (avoid hydration flicker), already
  // running installed, dismissed this session, or the browser has no way
  // to install (no native prompt available and not iOS Safari).
  if (!mounted || isStandalone || hidden) return null;
  if (!canInstall && !isIOS) return null;

  function handleDismiss() {
    try {
      window.sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
    } catch {
      // If storage is blocked, worst case the banner reappears on
      // navigation within the same session — not harmful.
    }
    setHidden(true);
  }

  async function handleInstallClick() {
    if (canInstall) {
      await promptInstall();
    }
  }

  return (
    <div className={styles.banner} role="dialog" aria-label="Install Sokobase app">
      <img src="/icons/icon-192.png" alt="" className={styles.icon} />
      <div className={styles.text}>
        <strong>Get the Sokobase app</strong>
        <span>
          {canInstall
            ? "Faster browsing, right from your home screen"
            : "Tap Share, then \u201cAdd to Home Screen\u201d"}
        </span>
      </div>
      <div className={styles.actions}>
        {canInstall && (
          <button type="button" className={styles.installButton} onClick={handleInstallClick}>
            <Download size={14} strokeWidth={2.4} />
            Install
          </button>
        )}
        <button type="button" className={styles.closeButton} onClick={handleDismiss} aria-label="Dismiss">
          <X size={16} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
