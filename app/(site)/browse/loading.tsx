import styles from "./browse.module.css";

export default function BrowseLoading() {
  return (
    <main className="container">
      <div className={styles.header}>
        <div className={styles.title} style={{ opacity: 0.3 }}>
          Loading listings&hellip;
        </div>
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "4/3",
              background: "var(--color-sage)",
              borderRadius: "var(--radius-lg)",
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </main>
  );
}
