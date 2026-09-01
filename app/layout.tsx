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

export const viewport: Viewport = {
  themeColor: "#1F7A4D",
  width: "device-width",
  initialScale: 1,
};

// iOS (Safari) doesn't build a launch screen from manifest.json the way
// Android/Chrome does — it needs a static PNG per device size, wired up
// via <link rel="apple-touch-startup-image">, matched by exact CSS
// device-width/height + pixel-ratio. The files these point to live in
// public/splash/ (generated placeholders in your brand colors — swap them
// for real designed art any time by overwriting the same filenames).
//
// This list covers the common modern iPhone/iPad sizes; add more pairs
// here (and matching images in public/splash/) for full device coverage.
const APPLE_SPLASH_SCREENS: { file: string; media: string }[] = [
  { file: "apple-splash-750-1334.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
  { file: "apple-splash-828-1792.png", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" },
  { file: "apple-splash-1125-2436.png", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
  { file: "apple-splash-1170-2532.png", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" },
  { file: "apple-splash-1179-2556.png", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
  { file: "apple-splash-1242-2688.png", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" },
  { file: "apple-splash-1284-2778.png", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" },
  { file: "apple-splash-1290-2796.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
  { file: "apple-splash-1620-2160.png", media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2)" },
  { file: "apple-splash-1668-2388.png", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" },
  { file: "apple-splash-2048-2732.png", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        {APPLE_SPLASH_SCREENS.map((screen) => (
          <link
            key={screen.file}
            rel="apple-touch-startup-image"
            href={`/splash/${screen.file}`}
            media={`${screen.media} and (orientation: portrait)`}
          />
        ))}
      </head>
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
