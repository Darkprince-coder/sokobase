import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
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
        <SearchX size={48} strokeWidth={1.5} style={{ color: "var(--color-sage)" }} />
        <h1 style={{ fontSize: "var(--text-3xl)", color: "var(--color-charcoal)" }}>
          Page not found
        </h1>
        <p style={{ color: "#6b756e", maxWidth: "40ch" }}>
          That listing may be sold and removed, or the link's outdated.
        </p>
        <Link
          href="/browse"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--color-primary)",
            color: "var(--color-white)",
            padding: "var(--space-3) var(--space-6)",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
          }}
        >
          Browse listings <ArrowRight size={15} strokeWidth={2.4} />
        </Link>
      </main>
      <Footer />
    </>
  );
}
