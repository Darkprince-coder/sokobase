import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="visually-hidden">
        Skip to content
      </a>
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
    </>
  );
}
