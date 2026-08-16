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
  Shirt,
} from "lucide-react";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import RentalCard from "@/components/RentalCard";
import MerchProductCard from "@/components/store/MerchProductCard";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import HeroBackground from "@/components/HeroBackground";
import { getCategories, getNewItems, getSecondhandItems } from "@/lib/listings";
import { getOpenRequests, getTrustStats } from "@/lib/requests";
import { getFeaturedRentals } from "@/lib/rentals";
import { getFeaturedMerch } from "@/lib/merch";
import { sellItemLink, requestItemLink, whatsappLink, formatPrice } from "@/lib/format";

export const revalidate = 60;

// Set these once you have real photos — e.g. "/hero-bg.jpg" after adding
// the file to /public/. Leave the default filename in place (or set the
// env var) and each section falls back to its gradient automatically if
// the image is missing or fails to load — see HeroBackground.tsx.
const HERO_IMAGE_SRC = process.env.NEXT_PUBLIC_HERO_IMAGE_URL || "/hero-bg.jpg";
const STORE_IMAGE_SRC = process.env.NEXT_PUBLIC_STORE_IMAGE_URL || "/store-bg.jpeg";
const RENTALS_IMAGE_SRC = process.env.NEXT_PUBLIC_RENTALS_IMAGE_URL || "/rentals-bg.jpg";
const REQUESTS_IMAGE_SRC = process.env.NEXT_PUBLIC_REQUESTS_IMAGE_URL || "/requests-bg.jpg";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Verified", text: "We check listings and note their condition clearly before they go live." },
  { icon: Tag, label: "Fair prices", text: "We help sellers price fairly and help buyers avoid overpaying." },
  { icon: MapPinned, label: "Safe meet-ups", text: "Buyers and sellers deal with us directly, so every handover is safe." },
  { icon: Users, label: "Hometown-first", text: "Built for your town, ready to grow with it." },
];

const MARKETPLACE_SECTIONS = [
  {
    icon: ShoppingBag,
    title: "Secondhand/ New Goods",
    text: "Phones, furniture, appliances and more, inspected before they're listed.",
    href: "/browse",
    live: true,
  },
  {
    icon: Shirt,
    title: "Hometown Store",
    text: "Official Kimana Ndio Hometown branded merchandise t-shirts, hoodies, jerseys and more.",
    href: "/store",
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
  const [categories, newItems, secondhandItems, featuredRentals, featuredMerch, openRequests, trustStats] =
    await Promise.all([
      getCategories(),
      getNewItems(4),
      getSecondhandItems(4),
      getFeaturedRentals(4),
      getFeaturedMerch(4),
      getOpenRequests(4),
      getTrustStats(),
    ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Hometown SokoBase",
        url: "https://sokobase.co.ke",
        logo: "https://sokobase.co.ke/brand/logo-mark.svg",
        description:
          "Hometown SokoBase is a local marketplace for secondhand and new goods, rentals, and official Hometown merchandise, with every listing verified before it goes live.",
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
        <HeroBackground src={HERO_IMAGE_SRC} />
        <Reveal className={`container ${styles.heroInner}`}>
          <img
            src="/brand/logo-mark.svg"
            alt="Hometown SokoBase verified inspection stamp"
            className={styles.heroMark}
          />
          <span className={styles.eyebrow}>Your hometown marketplace</span>
          <h1 className={styles.headline}>
            Buy, sell, rent, <span>and represent your hometown.</span>
          </h1>
          <p className={styles.subhead}>
            Hometown SokoBase connects buyers and sellers across secondhand
            and new goods, rentals, and official Hometown Store merchandise,
            with every listing checked and every deal handled with care.
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
              <h2 className={styles.sectionTitle}>Explore Marketplace</h2>
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

      {/* New goods */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>New goods</h2>
            <Link href="/browse?type=new" className={styles.sectionLink}>
              View all new goods <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </Reveal>
          {newItems.length > 0 ? (
            <div className={styles.grid}>
              {newItems.map((listing, i) => (
                <ProductCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>New items coming soon.</p>
          )}
        </div>
      </section>

      {/* Secondhand goods */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Secondhand goods</h2>
            <Link href="/browse?type=secondhand" className={styles.sectionLink}>
              View all secondhand <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </Reveal>
          {secondhandItems.length > 0 ? (
            <div className={styles.grid}>
              {secondhandItems.map((listing, i) => (
                <ProductCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Nothing listed yet. Check back soon.</p>
          )}
        </div>
      </section>

      {/* Hometown Store — intro band with photo, then featured products */}
      <section className={`${styles.section} ${styles.band}`}>
        <HeroBackground src={STORE_IMAGE_SRC} />
        <div className={`container ${styles.bandInner}`}>
          <Reveal>
            <span className={styles.bandEyebrow}>
              <Shirt size={14} strokeWidth={2.2} />
              Kimana Ndio Hometown
            </span>
            <h2 className={styles.bandTitle}>Wear your hometown, wherever you go</h2>
            <p className={styles.bandText}>
              Kimana Ndio Hometown is our own line of official merchandise
              t-shirts, sweatshirts, jerseys and more, made for anyone proud to
              represent where they&rsquo;re from. Every piece is quality
              checked before it leaves our store, straight to your wardrobe.
            </p>
            <div className={styles.bandActions}>
              <Link href="/store" className={styles.bandCta}>
                <Shirt size={16} strokeWidth={2.2} />
                Shop from our store
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Featured from Hometown Store</h2>
            <Link href="/store" className={styles.sectionLink}>
              Shop all <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </Reveal>
          {featuredMerch.length > 0 ? (
            <div className={styles.grid}>
              {featuredMerch.map((product, i) => (
                <MerchProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Add a featured product from the admin dashboard.</p>
          )}
        </div>
      </section>

      {/* Rentals — intro band with photo, then featured rentals */}
      <section className={`${styles.section} ${styles.band}`}>
        <HeroBackground src={RENTALS_IMAGE_SRC} />
        <div className={`container ${styles.bandInner}`}>
          <Reveal>
            <span className={styles.bandEyebrow}>
              <HomeIcon size={14} strokeWidth={2.2} />
              Rentals
            </span>
            <h2 className={styles.bandTitle}>Looking for a place?</h2>
            <p className={styles.bandText}>
              Homes and business premises for rent, with real photos and
              clear pricing. Electricity, water, and distance to town,
              listed upfront so there are no surprises when you show up.
            </p>
            <div className={styles.bandActions}>
              <Link href="/rentals" className={styles.bandCta}>
                <HomeIcon size={16} strokeWidth={2.2} />
                Browse rentals
              </Link>
              <WhatsAppLink
                href={whatsappLink("Hi Hometown SokoBase, I have a property I'd like to list for rent.")}
                label="home_rentals_list"
                className={styles.bandLink}
              >
                List a property <ArrowRight size={14} strokeWidth={2.4} />
              </WhatsAppLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Featured rentals</h2>
            <Link href="/rentals" className={styles.sectionLink}>
              View all <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </Reveal>
          {featuredRentals.length > 0 ? (
            <div className={styles.grid}>
              {featuredRentals.map((rental, i) => (
                <RentalCard key={rental.id} rental={rental} index={i} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>New rentals coming soon.</p>
          )}
        </div>
      </section>

      {/* Client requests — intro band with photo, then open requests */}
      <section className={`${styles.section} ${styles.band}`}>
        <HeroBackground src={REQUESTS_IMAGE_SRC} />
        <div className={`container ${styles.bandInner}`}>
          <Reveal>
            <span className={styles.bandEyebrow}>
              <Sparkles size={14} strokeWidth={2.2} />
              Looking for something?
            </span>
            <h2 className={styles.bandTitle}>Can&rsquo;t find what you need?</h2>
            <p className={styles.bandText}>
              Tell us what you&rsquo;re looking for and a budget if you have
              one. We&rsquo;ll keep an eye out and message you when we find
              a match.
            </p>
            <div className={styles.bandActions}>
              <WhatsAppLink
                href={requestItemLink()}
                label="home_request_button"
                className={styles.bandCta}
              >
                <MessageCircle size={16} strokeWidth={2.2} />
                Tell us what you&rsquo;re looking for
              </WhatsAppLink>
              <Link href="/requests" className={styles.bandLink}>
                See all requests <ArrowRight size={14} strokeWidth={2.4} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {openRequests.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <Reveal className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Recent requests</h2>
              <Link href="/requests" className={styles.sectionLink}>
                See all <ArrowRight size={14} strokeWidth={2.4} />
              </Link>
            </Reveal>
            <div className={styles.requestsGridCards}>
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
          </div>
        </section>
      )}

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
