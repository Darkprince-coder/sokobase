"use client";

import { useEffect, useState } from "react";
import { usePWA } from "./PWAProvider";
import styles from "./SplashScreen.module.css";

// Only re-show the splash on a true cold launch of the installed app, not
// on every client-side route change within the same session.
const SESSION_KEY = "sokobase_splash_shown";
// Floor so the splash never flashes for a single frame on a fast load.
const MIN_VISIBLE_MS = 700;
// Ceiling so a slow network never leaves someone staring at the splash
// indefinitely — it fades and lets the real (loading) UI show through.
const MAX_VISIBLE_MS = 2500;

type Phase = "hidden" | "visible" | "leaving";

export default function SplashScreen() {
  const { isStandalone } = usePWA();
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    if (!isStandalone) return;

    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage can be unavailable; treat as not-shown.
    }
    if (alreadyShown) return;

    setPhase("visible");
    const start = Date.now();

    const beginLeave = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        setPhase("leaving");
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // Non-fatal — worst case the splash reappears on the next nav.
        }
        // Give the CSS opacity transition (see .splash[data-leaving]) time
        // to finish before unmounting entirely.
        window.setTimeout(() => setPhase("hidden"), 350);
      }, wait);
    };

    if (document.readyState === "complete") {
      beginLeave();
    } else {
      window.addEventListener("load", beginLeave, { once: true });
    }

    // Safety net for slow connections — never block the app forever.
    const maxTimer = window.setTimeout(beginLeave, MAX_VISIBLE_MS);

    return () => {
      window.removeEventListener("load", beginLeave);
      window.clearTimeout(maxTimer);
    };
  }, [isStandalone]);

  if (phase === "hidden") return null;

  return (
    <div className={styles.splash} data-leaving={phase === "leaving"} role="status" aria-label="Loading">
      <img src="/brand/logo-mark.svg" alt="" className={styles.mark} />
      <p className={styles.word}>
        Hometown <span>SokoBase</span>
      </p>
      <span className={styles.tagline}>Everything local. One place.</span>
    </div>
  );
}
