import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWAProvider from "@/components/pwa/PWAProvider";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import BottomNav from "@/components/pwa/BottomNav";
import UpdateBanner from "@/components/pwa/UpdateBanner";
import SplashScreen from "@/components/pwa/SplashScreen";
import { WebOnly } from "@/components/pwa/Visibility";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PWAProvider>
      {/* Branded cold-launch splash — only ever renders inside the
          installed app (see SplashScreen.tsx), no-op on the website. */}
      <SplashScreen />

      {/* "New version ready" banner — only ever renders inside the
          installed app, no-op on the website. */}
      <UpdateBanner />

      <a href="#main-content" className="visually-hidden">
        Skip to content
      </a>

      {/* Header/Footer stay exactly as before on the plain website.
          Inside the installed app they're hidden entirely — the app uses
          BottomNav for navigation instead, closer to a native app shell. */}
      <WebOnly>
        <Header />
      </WebOnly>

      <div id="main-content">{children}</div>

      <WebOnly>
        <Footer />
      </WebOnly>

      {/* Both are no-ops on the plain website: InstallPrompt only shows
          when NOT installed, BottomNav only shows when running as the
          installed/standalone PWA. */}
      <InstallPrompt />
      <BottomNav />
    </PWAProvider>
  );
}
