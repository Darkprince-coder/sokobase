import Link from "next/link";
import {
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  MapPinned,
  Users,
  Sparkles,
  Home as HomeIcon,
  ShoppingBag,
  Car,
  Briefcase,
  Mountain,
} from "lucide-react";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import { getCategories, getFeaturedListings, getLatestListings, getNewItems } from "@/lib/listings";
import { getOpenRequests, getTrustStats } from "@/lib/requests";
import { getLatestRentals } from "@/lib/rentals";
import { sellItemLink, requestItemLink, whatsappLink, formatPrice } from "@/lib/format";

export const revalidate = 60;

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Verified", text: "We check listings and note their condition clearly before they go live." },
  { icon: Tag, label: "Fair prices", text: "We help sellers price fairly and help buyers avoid overpaying." },
  { icon: MapPinned, label: "Safe meet-ups", text: "Buyers and sellers deal with us directly, so every handover is safe." },
  { icon: Users, label: "Hometown-first", text: "Built for your town, ready to grow with it." },
];

const MARKETPLACE_SECTIONS = [
  {
    icon: ShoppingBag,
    title: "Secondhand Goods",
    text: "Phones, furniture, appliances and more, inspected before they're listed.",
    href: "/browse",
    live: true,
  },
  {
    icon: HomeIcon,
    title: "Rentals",
    text: "Homes and business premises for rent, with clear pricing.",
    href: "/rentals",
    live: true,
  },
  {
    icon: Mountain,
    title: "Land",
    text: "Plots and parcels for sale, coming to Hometown SokoBase soon.",
    href: null,
    live: false,
  },
  {
    icon: Car,
    title: "Vehicles",
    text: "Cars, motorbikes and more, coming to Hometown SokoBase soon.",
    href: null,
    live: false,
  },
  {
    icon: Briefcase,
    title: "Business Directory",
    text: "Local businesses and services, coming to Hometown SokoBase soon.",
    href: null,
    live: false,
  },
];

export default async function HomePage() {
  const [categories, featured, latest, newItems, latestRentals, openRequests, trustStats] =
    await Promise.all([
      getCategories(),
      getFeaturedListings(6),
      getLatestListings(8),
      getNewItems(8),
      getLatestRentals(3),
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
        name: "Hometown SokoBase",
        url: "https://sokobase.co.ke",
        logo: "https://sokobase.co.ke/brand/logo-mark.svg",
        description:
          "Hometown SokoBase is a local marketplace for secondhand and new goods and rentals, with every listing verified before it goes live.",
      },
      {
        "@type": "WebSite",
        name: "Hometown SokoBase",
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

      <section className={styles.hero}>
        <Reveal className={`container ${styles.heroInner}`}>
          <img
            src="/brand/logo-mark.svg"
            alt="Hometown SokoBase verified inspection stamp"
            className={styles.heroMark}
          />
          <span className={styles.eyebrow}>Your hometown marketplace</span>
          <h1 className={styles.headline}>
            Buy, sell, and rent, <span>all in your hometown.</span>
          </h1>
          <p className={styles.subhead}>
            Hometown SokoBase connects buyers and sellers across secondhand
            and new goods and rentals, with every listing checked and every
            deal handled with care.
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
              List with us
            </WhatsAppLink>
            <Link href="/browse" className={styles.heroCtaSecondary}>
              Browse listings
            </Link>
          </div>
        </Reveal>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>What are you looking for?</h2>
            <div className={styles.marketplaceGrid}>
              {MARKETPLACE_SECTIONS.map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <Icon className={styles.marketplaceIcon} size={26} strokeWidth={1.8} />
                    <span className={styles.marketplaceTitle}>{item.title}</span>
                    <p className={styles.marketplaceText}>{item.text}</p>
                    {!item.live && <span className={styles.comingSoonBadge}>Coming soon</span>}
                  </>
                );

                return item.live && item.href ? (
                  <Link key={item.title} href={item.href} className={styles.marketplaceTile}>
                    {content}
                  </Link>
                ) : (
                  <div key={item.title} className={styles.marketplaceTileSoon}>
                    {content}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {categories.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <Reveal>
              <h2 className={styles.sectionTitle}>Browse secondhand categories</h2>
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
            <p className={styles.empty}>Nothing listed yet. Check back soon.</p>
          )}
        </div>
      </section>

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
            <p className={styles.empty}>New listings coming soon.</p>
          )}
        </div>
      </section>

      {/* NEW — New Items section. Only renders once the admin has
          posted at least one listing_type = "new" item, so it never
          shows an empty/awkward section on a fresh install. */}
      {newItems.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <Reveal className={styles.sectionHead}>
              <div>
                <span className={styles.requestsEyebrow}>
                  <Sparkles size={14} strokeWidth={2.2} />
                  New items
                </span>
                <h2 className={styles.sectionTitle}>Fresh from our merchant partners</h2>
              </div>
              <Link href="/browse?type=new" className={styles.sectionLink}>
                View all <ArrowRight size={14} strokeWidth={2.4} />
              </Link>
            </Reveal>
            <div className={styles.grid}>
              {newItems.map((listing, i) => (
                <ProductCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`${styles.section} ${styles.requestsSection}`}>
        <div className="container">
          <Reveal className={styles.requestsInner}>
            <div>
              <span className={styles.requestsEyebrow}>
                <HomeIcon size={14} strokeWidth={2.2} />
                Rentals
              </span>
              <h2 className={styles.sectionTitle}>Looking for a place?</h2>
              <p className={styles.requestsText}>
                Homes and business premises for rent, with real photos and
                clear pricing. Electricity, water, and distance to town,
                listed upfront.
              </p>
              <div className={styles.requestsActions}>
                <Link href="/rentals" className={styles.requestsCta}>
                  <HomeIcon size={16} strokeWidth={2.2} />
                  Browse rentals
                </Link>
                <WhatsAppLink
                  href={whatsappLink("Hi Hometown SokoBase, I have a property I'd like to list for rent.")}
                  label="home_rentals_list"
                  className={styles.requestsLink}
                >
                  List a property <ArrowRight size={14} strokeWidth={2.4} />
                </WhatsAppLink>
              </div>
            </div>

            {latestRentals.length > 0 && (
              <div className={styles.requestsList}>
                {latestRentals.map((rental) => (
                  <Link
                    key={rental.id}
                    href={`/rentals/${rental.slug}`}
                    className={styles.requestCard}
                  >
                    <span className={styles.requestBadge}>{rental.house_type}</span>
                    <p className={styles.requestTitle}>{rental.title}</p>
                    <p className={`price-tag ${styles.requestBudget}`}>
                      {formatPrice(rental.monthly_rent)}/mo
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

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
                Tell us what you&rsquo;re looking for and we&rsquo;ll help
                you find it. See what other buyers are asking for below.
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

      <section className={`${styles.section} ${styles.howSection}`}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>How it works</h2>
          </Reveal>
          <div className={styles.steps}>
            <Reveal delay={0.05}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>01</span>
                <h3 className={styles.stepTitle}>Tell us what you have</h3>
                <p className={styles.stepText}>
                  Send photos, details, and your price on WhatsApp. Works for
                  items or properties.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>02</span>
                <h3 className={styles.stepTitle}>We verify it</h3>
                <p className={styles.stepText}>
                  We review the listing and, where possible, inspect it in
                  person before it goes live.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>03</span>
                <h3 className={styles.stepTitle}>Complete it safely</h3>
                <p className={styles.stepText}>
                  Buyers and tenants deal with us directly, so every
                  transaction stays safe and straightforward.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>Why use Hometown SokoBase</h2>
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

      <section className={styles.ctaBand}>
        <Reveal className={`container ${styles.ctaInner}`}>
          <h2 className={styles.ctaTitle}>Got something to list?</h2>
          <p className={styles.ctaText}>Message us on WhatsApp. We&rsquo;ll handle the rest.</p>
          <WhatsAppLink href={sellItemLink()} label="cta_band_sell_button" className={styles.ctaButton}>
            <MessageCircle size={16} strokeWidth={2.2} />
            List with us
          </WhatsAppLink>
        </Reveal>
      </section>
    </main>
  );
}
