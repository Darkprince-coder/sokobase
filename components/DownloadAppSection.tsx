"use client";

import { useState } from "react";
import { Download, Share, SquarePlus, MonitorSmartphone } from "lucide-react";
import { usePWA } from "@/components/pwa/PWAProvider";
import styles from "./DownloadAppSection.module.css";

export default function DownloadAppSection() {
  const { isStandalone, canInstall, promptInstall } = usePWA();
  const [installing, setInstalling] = useState(false);

  // Already running installed — nothing to prompt. (HomeRedirect also
  // bounces installed users off the homepage entirely, so this is mostly
  // a safety net for the brief moment before that redirect fires.)
  if (isStandalone) return null;

  async function handleInstall() {
    setInstalling(true);
    try {
      await promptInstall();
    } finally {
      setInstalling(false);
    }
  }

  return (
    <section className={styles.section} id="get-the-app">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>
              <MonitorSmartphone size={14} strokeWidth={2.2} />
              Get the app
            </span>
            <h2 className={styles.title}>Add Hometown SokoBase to your home screen</h2>
            <p className={styles.text}>
              Install the app for faster browsing and one-tap access from your home screen
              there's nothing to download from an app store, it takes a few seconds.
            </p>

            {/* Only shows when the browser actually supports the native
                install prompt (mainly Chrome/Edge on Android and desktop).
                Safari on iPhone/iPad never exposes this API, which is why
                the manual steps alongside always stay visible too. */}
            {canInstall && (
              <button
                type="button"
                className={styles.installButton}
                onClick={handleInstall}
                disabled={installing}
              >
                <Download size={16} strokeWidth={2.2} />
                {installing ? "Opening install prompt..." : "Install the app"}
              </button>
            )}
          </div>

          <div className={styles.steps}>
            <div className={styles.stepCard}>
              <span className={styles.stepIcon}>
                <Share size={18} strokeWidth={2} />
              </span>
              <div>
                <h3>On iPhone / iPad (Safari)</h3>
                <p>
                  Tap the <strong>Share</strong> icon in the address bar, choose{" "}
                  <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
                </p>
              </div>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepIcon}>
                <SquarePlus size={18} strokeWidth={2} />
              </span>
              <div>
                <h3>On Android (Chrome)</h3>
                <p>
                  Tap <strong>Install the app</strong> above, or open the &#8942; menu in Chrome
                  and choose <strong>Add to Home screen</strong> / <strong>Install app</strong>.
                </p>
              </div>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepIcon}>
                <MonitorSmartphone size={18} strokeWidth={2} />
              </span>
              <div>
                <h3>On a computer (Chrome / Edge)</h3>
                <p>
                  Look for the install icon on the right side of the address bar, or open the
                  browser menu and choose <strong>Install Hometown SokoBase&hellip;</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
