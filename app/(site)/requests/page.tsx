import type { Metadata } from "next";
import { MessageCircle, Search, CheckCircle2, ArrowRight } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import { getOpenRequests, getFulfilledRequests } from "@/lib/requests";
import { requestItemLink, sellItemLink, formatPrice } from "@/lib/format";
import styles from "./requests.module.css";

export const metadata: Metadata = {
  title: "Client Requests",
  description:
    "Can't find what you're looking for? Tell SokoBase what you need and we'll track it down. See what other Kimana buyers are requesting.",
};

export const revalidate = 60;

export default async function RequestsPage() {
  const [open, fulfilled] = await Promise.all([
    getOpenRequests(),
    getFulfilledRequests(),
  ]);

  return (
    <main className="container">
      <Reveal className={styles.hero}>
        <span className={styles.eyebrow}>Client requests</span>
        <h1 className={styles.title}>Can&rsquo;t find it? Ask us.</h1>
        <p className={styles.subtitle}>
          Tell us what you need and a budget if you have one. We&rsquo;ll
          keep an eye out and message you when we find a match.
        </p>
        <WhatsAppLink
          href={requestItemLink()}
          label="requests_page_submit"
          className={styles.submitButton}
        >
          <MessageCircle size={17} strokeWidth={2.2} />
          Submit a request
        </WhatsAppLink>
      </Reveal>

      <section className={styles.section}>
        <Reveal>
          <h2 className={styles.sectionTitle}>Open requests</h2>
          <p className={styles.sectionNote}>
            Have one of these? Sell it to us. There&rsquo;s a buyer waiting.
          </p>
        </Reveal>

        {open.length > 0 ? (
          <div className={styles.grid}>
            {open.map((req, i) => (
              <Reveal key={req.id} delay={Math.min(i, 6) * 0.05}>
                <div className={styles.card}>
                  <span className={styles.badgeOpen}>
                    <Search size={11} strokeWidth={2.4} />
                    Wanted
                  </span>
                  <h3 className={styles.cardTitle}>{req.product_title}</h3>
                  <p className={styles.cardDescription}>{req.description}</p>
                  {req.budget != null && (
                    <p className={`price-tag ${styles.budget}`}>
                      Budget: {formatPrice(req.budget)}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Nothing requested yet. Be the first to ask.</p>
        )}
      </section>

      {fulfilled.length > 0 && (
        <section className={styles.section}>
          <Reveal>
            <h2 className={styles.sectionTitle}>Recently fulfilled</h2>
            <p className={styles.sectionNote}>Proof we follow through.</p>
          </Reveal>
          <div className={styles.grid}>
            {fulfilled.map((req, i) => (
              <Reveal key={req.id} delay={Math.min(i, 6) * 0.05}>
                <div className={`${styles.card} ${styles.cardFulfilled}`}>
                  <span className={styles.badgeFulfilled}>
                    <CheckCircle2 size={11} strokeWidth={2.4} />
                    Fulfilled
                  </span>
                  <h3 className={styles.cardTitle}>{req.product_title}</h3>
                  <p className={styles.cardDescription}>{req.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Reveal className={styles.sellCta}>
        <p>Have something to sell instead?</p>
        <WhatsAppLink href={sellItemLink()} label="requests_page_sell" className={styles.sellLink}>
          Sell on SokoBase <ArrowRight size={14} strokeWidth={2.4} />
        </WhatsAppLink>
      </Reveal>
    </main>
  );
}
