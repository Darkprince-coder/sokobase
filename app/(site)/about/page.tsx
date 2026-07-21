import type { Metadata } from "next";
import { Target, ShieldCheck, Rocket, MessageCircle } from "lucide-react";
import { sellItemLink } from "@/lib/format";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "SokoBase is Kimana's local marketplace for second-hand goods, with every item personally inspected before sale.",
};

export default function AboutPage() {
  return (
    <main className="container">
      <Reveal className={styles.hero}>
        <span className={styles.eyebrow}>About SokoBase</span>
        <h1 className={styles.title}>Built for Kimana. Growing with Kajiado.</h1>
        <p className={styles.lead}>
          Too many sellers were getting underpaid by middlemen. So we cut
          them out. We connect sellers straight to buyers, inspect every
          item ourselves, and take a fair commission instead of a markup.
        </p>
      </Reveal>

      <div className={styles.grid}>
        <Reveal delay={0.05} className={styles.block}>
          <Target className={styles.blockIcon} size={24} strokeWidth={1.8} />
          <h2 className={styles.blockTitle}>Our mission</h2>
          <p>Fair prices for sellers. Real confidence for buyers. No markups.</p>
        </Reveal>
        <Reveal delay={0.1} className={styles.block}>
          <ShieldCheck className={styles.blockIcon} size={24} strokeWidth={1.8} />
          <h2 className={styles.blockTitle}>How we build trust</h2>
          <ul className={styles.list}>
            <li>Every item inspected before it's listed</li>
            <li>Meetups happen at our fixed office</li>
            <li>Commission agreed upfront, no hidden cuts</li>
            <li>Every listing gets the SokoBase stamp</li>
          </ul>
        </Reveal>
        <Reveal delay={0.15} className={styles.block}>
          <Rocket className={styles.blockIcon} size={24} strokeWidth={1.8} />
          <h2 className={styles.blockTitle}>Where we're headed</h2>
          <p>
            Kimana first, because we can inspect fast and meet in person.
            Next: Kajiado. Then rooms for house hunters, and a board for
            local jobs.
          </p>
        </Reveal>
      </div>

      <Reveal className={styles.cta}>
        <h2 className={styles.ctaTitle}>Got something to sell?</h2>
        <WhatsAppLink href={sellItemLink()} label="about_sell_button" className={styles.ctaButton}>
          <MessageCircle size={16} strokeWidth={2.2} />
          Message us on WhatsApp
        </WhatsAppLink>
      </Reveal>
    </main>
  );
}
