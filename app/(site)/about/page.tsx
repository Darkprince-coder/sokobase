import type { Metadata } from "next";
import { Target, ShieldCheck, Rocket, MessageCircle } from "lucide-react";
import { sellItemLink } from "@/lib/format";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Hometown SokoBase is a local marketplace for secondhand goods and rentals, built in Kimana and growing across the region.",
};

export default function AboutPage() {
  return (
    <main className="container">
      <Reveal className={styles.hero}>
        <span className={styles.eyebrow}>About Hometown SokoBase</span>
        <h1 className={styles.title}>Built in Kimana. Growing with every town we reach.</h1>
        <p className={styles.lead}>
          Hometown SokoBase started as a way to make buying and selling
          secondhand goods easier and more trustworthy. We've since grown
          into a wider marketplace, connecting people across secondhand
          goods and rentals, with more categories on the way, all under one
          platform built for the towns we serve.
        </p>
      </Reveal>

      <div className={styles.grid}>
        <Reveal delay={0.05} className={styles.block}>
          <Target className={styles.blockIcon} size={24} strokeWidth={1.8} />
          <h2 className={styles.blockTitle}>Our mission</h2>
          <p>Fair prices for sellers. Real confidence for buyers and tenants.</p>
        </Reveal>
        <Reveal delay={0.1} className={styles.block}>
          <ShieldCheck className={styles.blockIcon} size={24} strokeWidth={1.8} />
          <h2 className={styles.blockTitle}>How we build trust</h2>
          <ul className={styles.list}>
            <li>Listings are checked before they go live</li>
            <li>Every deal is handled with a real person, not a stranger online</li>
            <li>Pricing and terms are agreed upfront, no hidden cuts</li>
            <li>Every listing carries the Hometown SokoBase stamp</li>
          </ul>
        </Reveal>
        <Reveal delay={0.15} className={styles.block}>
          <Rocket className={styles.blockIcon} size={24} strokeWidth={1.8} />
          <h2 className={styles.blockTitle}>Where we're headed</h2>
          <p>
            We're starting with secondhand goods and rentals, residential
            and commercial. Land, vehicles, and a local business directory
            are next, all part of one platform built to grow with the
            towns we serve.
          </p>
        </Reveal>
      </div>

      <Reveal className={styles.cta}>
        <h2 className={styles.ctaTitle}>Got something to list?</h2>
        <WhatsAppLink href={sellItemLink()} label="about_sell_button" className={styles.ctaButton}>
          <MessageCircle size={16} strokeWidth={2.2} />
          Message us on WhatsApp
        </WhatsAppLink>
      </Reveal>
    </main>
  );
}
