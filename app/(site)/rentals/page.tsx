import type { Metadata } from "next";
import { Home as HomeIcon, MessageCircle, Camera, Zap, MapPin } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import { whatsappLink } from "@/lib/format";
import styles from "./rentals.module.css";

export const metadata: Metadata = {
  title: "Rentals",
  description:
    "SokoBase is building a rentals board for Kimana, so finding a vacant house doesn't mean weeks of asking around town.",
};

const FEATURES = [
  {
    icon: Camera,
    title: "Real listings",
    text: "Actual photos of the actual house. Monthly rent and deposit, upfront, no surprises when you show up.",
  },
  {
    icon: Zap,
    title: "The details that matter",
    text: "Electricity, water, and distance to town, listed clearly so you know what you're walking into.",
  },
  {
    icon: MapPin,
    title: "One place to check",
    text: "No more asking ten different people if they know a vacant house. Just one board, kept up to date.",
  },
];

export default function RentalsPage() {
  const notifyLink = whatsappLink(
    "Hi SokoBase, please let me know when the rentals board goes live."
  );

  return (
    <main className="container">
      <Reveal className={styles.hero}>
        <span className={styles.eyebrow}>
          <HomeIcon size={14} strokeWidth={2.2} />
          Coming soon
        </span>
        <h1 className={styles.title}>House hunting in Kimana, sorted.</h1>
        <p className={styles.subtitle}>
          Finding a vacant house here usually means calling everyone you
          know and hoping someone's heard something. We're fixing that.
        </p>
        <WhatsAppLink href={notifyLink} label="rentals_page_notify" className={styles.notifyButton}>
          <MessageCircle size={16} strokeWidth={2.2} />
          Notify me when it's live
        </WhatsAppLink>
      </Reveal>

      <div className={styles.grid}>
        {FEATURES.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.05}>
            <div className={styles.card}>
              <Icon className={styles.cardIcon} size={22} strokeWidth={1.8} />
              <h2 className={styles.cardTitle}>{title}</h2>
              <p className={styles.cardText}>{text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className={styles.landlordCta}>
        <p className={styles.landlordText}>
          Got a vacant house? List it with us when we launch.
        </p>
        <WhatsAppLink href={notifyLink} label="rentals_page_landlord" className={styles.landlordLink}>
          Get in touch <MessageCircle size={14} strokeWidth={2.4} />
        </WhatsAppLink>
      </Reveal>
    </main>
  );
}
