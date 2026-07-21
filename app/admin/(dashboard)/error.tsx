"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-sage)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-8)",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>
        Something went wrong
      </h1>
      <p style={{ color: "#6b756e", marginBottom: "var(--space-4)" }}>
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        style={{
          background: "var(--color-primary)",
          color: "var(--color-white)",
          border: "none",
          padding: "var(--space-2) var(--space-5)",
          borderRadius: "var(--radius-sm)",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
