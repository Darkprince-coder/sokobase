"use client";

import { RefreshCw } from "lucide-react";

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "var(--space-4)",
        padding: "var(--space-24) var(--space-4)",
      }}
    >
      <h1 style={{ fontSize: "var(--text-2xl)", color: "var(--color-charcoal)" }}>
        Something went wrong
      </h1>
      <p style={{ color: "#6b756e", maxWidth: "40ch" }}>
        That page hit a snag. Try again, or head back to browsing.
      </p>
      <button
        onClick={reset}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "var(--color-primary)",
          color: "var(--color-white)",
          padding: "var(--space-3) var(--space-6)",
          borderRadius: "var(--radius-md)",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
        }}
      >
        <RefreshCw size={15} strokeWidth={2.2} />
        Try again
      </button>
    </main>
  );
}
