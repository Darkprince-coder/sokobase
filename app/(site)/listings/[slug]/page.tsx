import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, Info } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import ProductCard from "@/components/ProductCard";
import StatusBadge from "@/components/StatusBadge";
import ListingOrderPanel from "@/components/ListingOrderPanel";
import Reveal from "@/components/motion/Reveal";
import { getListingBySlug, getRelatedListings } from "@/lib/listings";
import { formatPrice, discountPercent } from "@/lib/format";
import styles from "./listing.module.css";

export const revalidate = 30; // Revalidate cached data every 30 seconds

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  if (!listing) return {};

  const description = listing.description.slice(0, 155);

  return {
    title: listing.title,
    description,
    openGraph: {
      title: listing.title,
      description,
      type: "website",
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  const related = await getRelatedListings(listing.category_id, listing.id);
  const pageUrl = `https://sokobase.co.ke/listings/${listing.slug}`;
  const isNew = listing.listing_type === "new";
  const discount = discountPercent(listing.price, listing.compare_at_price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.images,
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: listing.price,
      availability:
        listing.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition:
        listing.condition === "New"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    },
  };

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.layout}>
        <Reveal>
          <ImageGallery images={listing.images} alt={listing.title} />
        </Reveal>

        <Reveal delay={0.08} className={styles.info}>
          <div className={styles.badgeRow}>
            <StatusBadge status={listing.status} soldLabel={isNew ? "Sold out" : undefined} />
            <span className={isNew ? styles.typeTagNew : styles.typeTagSecondhand}>
              {isNew ? "New" : "Secondhand"}
            </span>
            {listing.badge && <span className={styles.merchBadge}>{listing.badge}</span>}
            {listing.verified && (
              <span className={styles.verified}>
                <ShieldCheck size={13} strokeWidth={2.2} />
                Inspected
              </span>
            )}
          </div>

          <h1 className={styles.title}>{listing.title}</h1>

          <div className={styles.priceRow}>
            <p className={`price-tag ${styles.price}`}>{formatPrice(listing.price)}</p>
            {discount !== null && <span className={styles.discountPill}>-{discount}% OFF</span>}
          </div>
          {listing.compare_at_price && discount !== null && (
            <p className={styles.comparePrice}>{formatPrice(listing.compare_at_price)}</p>
          )}

          <dl className={styles.specs}>
            {!isNew && (
              <div>
                <dt>Condition</dt>
                <dd>{listing.condition}</dd>
              </div>
            )}
            <div>
              <dt>Category</dt>
              <dd>{listing.category?.name ?? "Uncategorized"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{listing.location}</dd>
            </div>
            {isNew && listing.merchant_name && (
              <div>
                <dt>Supplied by</dt>
                <dd>{listing.merchant_name}</dd>
              </div>
            )}
          </dl>

          <div className={styles.description}>
            <h2 className={styles.sectionLabel}>Description</h2>
            <p>{listing.description}</p>
          </div>

          {listing.specs.length > 0 && (
            <div className={styles.description}>
              <h2 className={styles.sectionLabel}>Specifications</h2>
              <dl className={styles.specSheet}>
                {listing.specs.map((spec, i) => (
                  <div key={i} className={styles.specSheetRow}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <ListingOrderPanel listing={listing} pageUrl={pageUrl} />

          <p className={styles.notice}>
            <Info size={14} strokeWidth={2} />
            {isNew
              ? "Order today, delivered or ready for pickup in Kimana."
              : "Inspect before you pay. No refunds after payment."}
          </p>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <Reveal>
            <h2 className={styles.sectionTitle}>You might also like</h2>
          </Reveal>
          <div className={styles.relatedGrid}>
            {related.map((item, i) => (
              <ProductCard key={item.id} listing={item} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
