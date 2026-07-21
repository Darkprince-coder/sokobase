export default function ListingLoading() {
  return (
    <main className="container">
      <div
        style={{
          display: "grid",
          gap: "var(--space-8)",
          padding: "var(--space-8) 0",
        }}
      >
        <div
          style={{
            aspectRatio: "4/3",
            background: "var(--color-sage)",
            borderRadius: "var(--radius-lg)",
            opacity: 0.5,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div
            style={{
              height: 32,
              width: "70%",
              background: "var(--color-sage)",
              borderRadius: 6,
              opacity: 0.5,
            }}
          />
          <div
            style={{
              height: 24,
              width: "30%",
              background: "var(--color-sage)",
              borderRadius: 6,
              opacity: 0.4,
            }}
          />
        </div>
      </div>
    </main>
  );
}
