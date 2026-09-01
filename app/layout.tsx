import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "../styles/globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GAPageViewTracker from "@/components/GAPageViewTracker";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = "https://sokobase.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hometown SokoBase: Buy, Sell & Rent Locally",
    template: "%s | Hometown SokoBase",
  },
  description:
    "Hometown SokoBase is a local marketplace for secondhand goods and rentals, with every listing verified and every deal handled with care. Built in Kimana, growing across the region.",
  keywords: [
    "Kimana marketplace",
    "buy and sell Kimana",
    "second hand Kimana",
    "houses for rent Kimana",
    "Hometown SokoBase",
    "SokoBase",
    "Kajiado marketplace",
  ],
  openGraph: {
    title: "Hometown SokoBase: Buy, Sell & Rent Locally",
    description:
      "A local marketplace for secondhand goods and rentals. Every listing verified, every deal handled with care.",
    url: siteUrl,
    siteName: "Hometown SokoBase",
    locale: "en_KE",
    type: "website",
  },
  icons: {
    icon: "/brand/logo-mark.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  // NEW — PWA: links public/manifest.json and marks the site installable.
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sokobase",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

// NEW — PWA: theme-color drives the browser/OS chrome color for the
// installed app (status bar, task switcher card, etc.).
export const viewport: Viewport = {
  themeColor: "#1F7A4D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}
      >
        {children}
        {gaId && (
          <>
            <GoogleAnalytics gaId={gaId} />
            <Suspense fallback={null}>
              <GAPageViewTracker gaId={gaId} />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
