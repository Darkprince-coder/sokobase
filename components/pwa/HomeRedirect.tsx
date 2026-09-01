"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePWA } from "./PWAProvider";

/**
 * The installed app should never show the marketing homepage — manifest.json
 * already opens straight to /browse on launch, but this covers anyone who
 * navigates back to "/" from inside the running app (e.g. tapping the brand
 * mark in a component that isn't wrapped in WebOnly). Renders nothing; it
 * only redirects.
 */
export default function HomeRedirect() {
  const { isStandalone } = usePWA();
  const router = useRouter();

  useEffect(() => {
    if (isStandalone) {
      router.replace("/browse");
    }
  }, [isStandalone, router]);

  return null;
}
