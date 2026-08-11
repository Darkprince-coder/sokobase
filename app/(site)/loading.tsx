export default function SiteLoading() {
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
            width: "100%",
            maxWidth: 560,
            height: 28,
            background: "var(--color-sage)",
            borderRadius: 12,
            opacity: 0.35,
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              style={{
                aspectRatio: "4/3",
                background: "var(--color-sage)",
                borderRadius: "var(--radius-lg)",
                opacity: 0.45,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
