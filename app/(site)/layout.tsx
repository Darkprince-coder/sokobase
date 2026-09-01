import Header from "@/components/Header";
import Footer from "@/components/Footer";
// NEW — PWA
import PWAProvider from "@/components/pwa/PWAProvider";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import BottomNav from "@/components/pwa/BottomNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PWAProvider>
      <a href="#main-content" className="visually-hidden">
        Skip to content
      </a>
      <Header />
      <div id="main-content">{children}</div>
      <Footer />

      {/* Both are no-ops on the plain website: InstallPrompt only shows
          when NOT installed, BottomNav only shows when running as the
          installed/standalone PWA. */}
      <InstallPrompt />
      <BottomNav />
    </PWAProvider>
  );
}
