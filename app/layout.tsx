import type { Metadata } from "next";
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

const siteUrl = "https://sokobase.co.ke"; // update once the real domain is live

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SokoBase: Buy & Sell Locally in Kimana",
    template: "%s | SokoBase",
  },
  description:
    "SokoBase is Kimana's local marketplace for second-hand goods. Every item is inspected before sale, with safe office meet-ups and fair prices for sellers.",
  keywords: [
    "Kimana marketplace",
    "buy and sell Kimana",
    "second hand Kimana",
    "SokoBase",
    "Kajiado second hand goods",
  ],
  openGraph: {
    title: "SokoBase: Buy & Sell Locally in Kimana",
    description: "Kimana's local marketplace. Every item inspected before sale.",
    url: siteUrl,
    siteName: "SokoBase",
    locale: "en_KE",
    type: "website",
  },
  icons: {
    icon: "/brand/logo-mark.svg",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
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
