"use client";

import { usePWA } from "./PWAProvider";

/**
 * Renders children only on the plain website. Hidden inside the installed,
 * standalone app — use this to wrap Header/Footer and any other marketing
 * chrome that shouldn't show once someone has added the app to their home
 * screen.
 *
 * Note: standalone-mode can only be detected client-side, so on first
 * paint this always renders its children (matching SSR) and only hides
 * them after mount if the app turns out to be running standalone. That
 * means installed-app users may see a one-frame flash of the header/footer
 * before it disappears — normal for this kind of detection, and the same
 * trade-off InstallPrompt/BottomNav already make elsewhere in this app.
 */
export function WebOnly({ children }: { children: React.ReactNode }) {
  const { isStandalone } = usePWA();
  if (isStandalone) return null;
  return <>{children}</>;
}

/**
 * Renders children only inside the installed, standalone app. Hidden on
 * the plain website. Opposite of WebOnly — same detection caveat applies.
 */
export function AppOnly({ children }: { children: React.ReactNode }) {
  const { isStandalone } = usePWA();
  if (!isStandalone) return null;
  return <>{children}</>;
}
