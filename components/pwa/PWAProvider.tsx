"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface PWAContextValue {
  /** True once we've detected the app is running installed/standalone. */
  isStandalone: boolean;
  /** True on iOS Safari, which never fires beforeinstallprompt. */
  isIOS: boolean;
  /** True once the browser has handed us a real install prompt to trigger. */
  canInstall: boolean;
  /** Triggers the native "Add to Home Screen" prompt (Chrome/Edge/Android). */
  promptInstall: () => Promise<void>;
}

const PWAContext = createContext<PWAContextValue>({
  isStandalone: false,
  isIOS: false,
  canInstall: false,
  promptInstall: async () => {},
});

export function usePWA() {
  return useContext(PWAContext);
}

export const PWA_INSTALLED_KEY = "sokobase_pwa_installed";

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const standaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
    const iosStandalone = (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMedia || iosStandalone);

    const ua = window.navigator.userAgent;
    setIsIOS(/iphone|ipad|ipod/i.test(ua) && !("MSStream" in window));

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal — the site still works without offline support.
      });
    }

    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    function handleInstalled() {
      setDeferredPrompt(null);
      setIsStandalone(true);
      try {
        window.localStorage.setItem(PWA_INSTALLED_KEY, "1");
      } catch {
        // Storage can be unavailable (private browsing); safe to ignore.
      }

      fetch("/api/pwa/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        }),
      }).catch(() => {
        // Analytics logging failing shouldn't affect the install itself.
      });
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return (
    <PWAContext.Provider value={{ isStandalone, isIOS, canInstall: Boolean(deferredPrompt), promptInstall }}>
      {children}
    </PWAContext.Provider>
  );
}
