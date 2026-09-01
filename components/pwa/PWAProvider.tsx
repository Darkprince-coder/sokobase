"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface PWAContextValue {
  /** True once we've detected the app is running installed/standalone. */
  isStandalone: boolean;
  /** True on iOS Safari, which never fires beforeinstallprompt. */
  isIOS: boolean;
  /** True once the browser has handed us a real install prompt to trigger. */
  canInstall: boolean;
  /** Triggers the native "Add to Home Screen" prompt (Chrome/Edge/Android). */
  promptInstall: () => Promise<void>;
  /** True once a new service worker has installed and is waiting to take over. */
  updateAvailable: boolean;
  /** Activates the waiting service worker and reloads the page. */
  applyUpdate: () => void;
}

const PWAContext = createContext<PWAContextValue>({
  isStandalone: false,
  isIOS: false,
  canInstall: false,
  promptInstall: async () => {},
  updateAvailable: false,
  applyUpdate: () => {},
});

export function usePWA() {
  return useContext(PWAContext);
}

export const PWA_INSTALLED_KEY = "sokobase_pwa_installed";

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    const standaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
    const iosStandalone = (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMedia || iosStandalone);

    const ua = window.navigator.userAgent;
    setIsIOS(/iphone|ipad|ipod/i.test(ua) && !("MSStream" in window));

    function markWaiting(worker: ServiceWorker | null) {
      if (!worker) return;
      waitingWorkerRef.current = worker;
      setUpdateAvailable(true);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // An update may already be sitting in "waiting" from a previous
          // visit (e.g. the person closed the app before it could reload).
          if (registration.waiting && registration.active) {
            markWaiting(registration.waiting);
          }

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              // "installed" + an existing controller means this install is
              // an update to an already-running app, not the first visit.
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                markWaiting(newWorker);
              }
            });
          });

          // Installed apps rarely get a full page reload, so the browser's
          // normal "check on navigation" update check doesn't fire often
          // enough on its own. Re-check whenever the app regains focus.
          const recheck = () => {
            if (document.visibilityState === "visible") {
              registration.update().catch(() => {});
            }
          };
          document.addEventListener("visibilitychange", recheck);
          window.addEventListener("focus", recheck);
        })
        .catch(() => {
          // Non-fatal — the site still works without offline support.
        });

      let hasReloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (hasReloaded) return;
        hasReloaded = true;
        window.location.reload();
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

  const applyUpdate = useCallback(() => {
    const worker = waitingWorkerRef.current;
    if (!worker) {
      // No waiting worker reference (e.g. state was lost) — a hard reload
      // still picks up whatever is newest, so fall back to that.
      window.location.reload();
      return;
    }
    worker.postMessage("SKIP_WAITING");
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isStandalone,
        isIOS,
        canInstall: Boolean(deferredPrompt),
        promptInstall,
        updateAvailable,
        applyUpdate,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}
