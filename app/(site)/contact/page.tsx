import type { Metadata } from "next";
import { MessageCircle, MapPin, PackagePlus, ArrowRight } from "lucide-react";
import { siteConfig, mapsSearchUrl } from "@/lib/siteConfig";
import { sellItemLink, whatsappLink } from "@/lib/format";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Visit the SokoBase office in Kimana to inspect an item, drop off something to sell, or reach us on WhatsApp.",
};

export default function ContactPage() {
  return (
    <main className="container">
      <Reveal className={styles.header}>
        <h1 className={styles.title}>Contact us</h1>
        <p className={styles.subtitle}>
          Buying, selling, or just have a question? WhatsApp is fastest.
        </p>
      </Reveal>

      <div className={styles.grid}>
        <Reveal delay={0.05} className={styles.card}>
          <MessageCircle className={styles.cardIcon} size={22} strokeWidth={1.8} />
          <h2 className={styles.cardTitle}>WhatsApp</h2>
          <p className={styles.cardText}>Fastest way to reach us, for anything.</p>
          <WhatsAppLink
            href={whatsappLink("Hi SokoBase, I have a question.")}
            label="contact_general_whatsapp"
            className={styles.cardLink}
          >
            Chat with us <ArrowRight size={14} strokeWidth={2.4} />
          </WhatsAppLink>
        </Reveal>

        <Reveal delay={0.1} className={styles.card}>
          <MapPin className={styles.cardIcon} size={22} strokeWidth={1.8} />
          <h2 className={styles.cardTitle}>Visit our office</h2>
          <p className={styles.cardText}>{siteConfig.officeName}</p>
          <p className={styles.cardText}>{siteConfig.addressLine}</p>
          <p
            className={styles.cardText}
            dangerouslySetInnerHTML={{ __html: siteConfig.hours }}
          />
          <a
            href={mapsSearchUrl(siteConfig.mapsQuery)}
            className={styles.cardLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions <ArrowRight size={14} strokeWidth={2.4} />
          </a>
        </Reveal>

        <Reveal delay={0.15} className={styles.card}>
          <PackagePlus className={styles.cardIcon} size={22} strokeWidth={1.8} />
          <h2 className={styles.cardTitle}>Selling something?</h2>
          <p className={styles.cardText}>Send photos, a description, your price.</p>
          <WhatsAppLink href={sellItemLink()} label="contact_sell_button" className={styles.cardLink}>
            Start selling <ArrowRight size={14} strokeWidth={2.4} />
          </WhatsAppLink>
        </Reveal>
      </div>
    </main>
  );
}
