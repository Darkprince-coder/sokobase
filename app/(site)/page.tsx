import Link from "next/link";
import {
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  MapPinned,
  Users,
  Sparkles,
} from "lucide-react";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import { getCategories, getFeaturedListings, getLatestListings } from "@/lib/listings";
import { getOpenRequests, getTrustStats } from "@/lib/requests";
import { sellItemLink, requestItemLink, formatPrice } from "@/lib/format";

export const revalidate = 60; // re-fetch listings at most once a minute

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Verified", text: "We inspect listed items and point out their condition clearly." },
  { icon: Tag, label: "Fair prices", text: "You tell us what you want for your item. We help you find a fair price and a serious buyer." },
  { icon: MapPinned, label: "Safe meet-ups", text: "Buyers and sellers meet at our office to inspect the item and complete the sale." },
  { icon: Users, label: "Community-built", text: "Made for Kimana, growing with Kajiado." },
];

export default async function HomePage() {
  const [categories, featured, latest, openRequests, trustStats] = await Promise.all([
    getCategories(),
    getFeaturedListings(6),
    getLatestListings(8),
    getOpenRequests(3),
    getTrustStats(),
  ]);

  const showTrustStats =
    trustStats.itemsSold > 0 ||
    trustStats.transactionsCompleted > 0 ||
    trustStats.satisfiedCustomers > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "SokoBase",
        url: "https://sokobase.co.ke",
        logo: "https://sokobase.co.ke/brand/logo-mark.svg",
        description:
          "SokoBase is Kimana's local marketplace for second-hand goods. Every item is personally inspected before sale.",
      },
      {
        "@type": "WebSite",
        name: "SokoBase",
        url: "https://sokobase.co.ke",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://sokobase.co.ke/browse?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <Reveal className={`container ${styles.heroInner}`}>
          <img
            src="/brand/logo-mark.svg"
            alt="SokoBase verified inspection stamp"
            className={styles.heroMark}
          />
          <span className={styles.eyebrow}>Built for community.</span>
          <h1 className={styles.headline}>
            Buy & sell secondhand items. <span>with ease.</span>
          </h1>
          <p className={styles.subhead}>
           SokoBase helps people buy and sell used items at fair prices. We inspect items, connect buyers with sellers and offer safe and smooth transaction.
          </p>

          <form action="/browse" method="get" className={styles.search}>
            <input
              type="text"
              name="q"
              placeholder="Search phones, furniture, appliances..."
              className={styles.searchInput}
              aria-label="Search listings"
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>

          <div className={styles.heroActions}>
            <WhatsAppLink href={sellItemLink()} label="hero_sell_button" className={styles.heroCta}>
              <MessageCircle size={16} strokeWidth={2.2} />
              Sell on sokobase
            </WhatsAppLink>
            <Link href="/browse" className={styles.heroCtaSecondary}>
              Browse items
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ---- Categories ---- */}
      {categories.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <Reveal>
              <h2 className={styles.sectionTitle}>Shop by category</h2>
              <div className={styles.categoryRow}>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/browse?category=${cat.slug}`}
                    className={styles.categoryChip}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---- Featured Listings ---- */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Featured</h2>
            <Link href="/browse" className={styles.sectionLink}>
              View all <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </Reveal>
          {featured.length > 0 ? (
            <div className={styles.grid}>
              {featured.map((listing, i) => (
                <ProductCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              Nothing listed yet, check back soon!.
            </p>
          )}
        </div>
      </section>

      {/* ---- Latest Listings ---- */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Just listed</h2>
            <Link href="/browse" className={styles.sectionLink}>
              View all <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </Reveal>
          {latest.length > 0 ? (
            <div className={styles.grid}>
              {latest.map((listing, i) => (
                <ProductCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              New listings coming soon.
            </p>
          )}
        </div>
      </section>

      {/* ---- Client Requests teaser ---- */}
      <section className={`${styles.section} ${styles.requestsSection}`}>
        <div className="container">
          <Reveal className={styles.requestsInner}>
            <div>
              <span className={styles.requestsEyebrow}>
                <Sparkles size={14} strokeWidth={2.2} />
                Looking for something?
              </span>
              <h2 className={styles.sectionTitle}>Can&rsquo;t find what you need?</h2>
              <p className={styles.requestsText}>
                Tell us what you're looking for. Someone nearby might have exactly what you need.See what
                other buyers are hunting for below.
              </p>
              <div className={styles.requestsActions}>
                <WhatsAppLink
                  href={requestItemLink()}
                  label="home_request_button"
                  className={styles.requestsCta}
                >
                  <MessageCircle size={16} strokeWidth={2.2} />
                  Tell us what you're looking for
                </WhatsAppLink>
                <Link href="/requests" className={styles.requestsLink}>
                  See all requests <ArrowRight size={14} strokeWidth={2.4} />
                </Link>
              </div>
            </div>

            {openRequests.length > 0 && (
              <div className={styles.requestsList}>
                {openRequests.map((req) => (
                  <div key={req.id} className={styles.requestCard}>
                    <span className={styles.requestBadge}>Wanted</span>
                    <p className={styles.requestTitle}>{req.product_title}</p>
                    {req.budget != null && (
                      <p className={`price-tag ${styles.requestBudget}`}>
                        Budget: {formatPrice(req.budget)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ---- How It Works: a real 3-step process, so numbering it is earned ---- */}
      <section className={`${styles.section} ${styles.howSection}`}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>How it works</h2>
          </Reveal>
          <div className={styles.steps}>
            <Reveal delay={0.05}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>01</span>
                <h3 className={styles.stepTitle}>Tell us what you're selling</h3>
                <p className={styles.stepText}>Send us photos, the details and the price you're hoping to get. We'll take it from there</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>02</span>
                <h3 className={styles.stepTitle}>We inspect it</h3>
                <p className={styles.stepText}>
                 If you're nearby, we inspect the item ourselves. We agree on the price and commission before it is listed.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>03</span>
                <h3 className={styles.stepTitle}>Buyer checks before paying</h3>
                <p className={styles.stepText}>
                 When someone is interested, they come to our office to see and test the item. If everything checks out, the sale is completed.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Trust Features ---- */}
      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>Why use SokoBase</h2>
          </Reveal>
          <div className={styles.trustGrid}>
            {TRUST_ITEMS.map(({ icon: Icon, label, text }, i) => (
              <Reveal key={label} delay={i * 0.05}>
                <div className={styles.trustItem}>
                  <Icon className={styles.trustIcon} size={22} strokeWidth={1.8} />
                  <span className={styles.trustLabel}>{label}</span>
                  <p className={styles.trustText}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Trust Stats: real numbers, only shown once there's something to show ---- */}
      {showTrustStats && (
        <section className={styles.statsBand}>
          <Reveal className={`container ${styles.statsInner}`}>
            <div className={styles.statBlock}>
              <span className={styles.statNumber}>{trustStats.itemsSold}</span>
              <span className={styles.statCaption}>Items sold</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statNumber}>{trustStats.transactionsCompleted}</span>
              <span className={styles.statCaption}>Transactions</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statNumber}>{trustStats.satisfiedCustomers}</span>
              <span className={styles.statCaption}>Happy customers</span>
            </div>
          </Reveal>
        </section>
      )}

      {/* ---- CTA ---- */}
      <section className={styles.ctaBand}>
        <Reveal className={`container ${styles.ctaInner}`}>
          <h2 className={styles.ctaTitle}>Got something to sell?</h2>
          <p className={styles.ctaText}>Message us on WhatsApp. We&rsquo;ll handle the rest.</p>
          <WhatsAppLink href={sellItemLink()} label="cta_band_sell_button" className={styles.ctaButton}>
            <MessageCircle size={16} strokeWidth={2.2} />
            Sell on SokoBase
          </WhatsAppLink>
        </Reveal>
      </section>
    </main>
  );
}
