import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, MessageCircle, Info } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import ProductCard from "@/components/ProductCard";
import StatusBadge from "@/components/StatusBadge";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import { getListingBySlug, getRelatedListings } from "@/lib/listings";
import { formatPrice, inquireListingLink } from "@/lib/format";
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
            <StatusBadge status={listing.status} />
            {listing.verified && (
              <span className={styles.verified}>
                <ShieldCheck size={13} strokeWidth={2.2} />
                Inspected
              </span>
            )}
          </div>

          <h1 className={styles.title}>{listing.title}</h1>
          <p className={`price-tag ${styles.price}`}>{formatPrice(listing.price)}</p>

          <dl className={styles.specs}>
            <div>
              <dt>Condition</dt>
              <dd>{listing.condition}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{listing.category?.name ?? "Uncategorized"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{listing.location}</dd>
            </div>
          </dl>

          <div className={styles.description}>
            <h2 className={styles.sectionLabel}>Description</h2>
            <p>{listing.description}</p>
          </div>

          {listing.status === "available" ? (
            <WhatsAppLink
              href={inquireListingLink(listing.title, pageUrl)}
              label={`listing_${listing.slug}`}
              className={styles.cta}
            >
              <MessageCircle size={17} strokeWidth={2.2} />
              Chat to buy on WhatsApp
            </WhatsAppLink>
          ) : (
            <div className={styles.unavailable}>
              This item is {listing.status}. Check{" "}
              <a href="/browse">other listings</a>.
            </div>
          )}

          <p className={styles.notice}>
            <Info size={14} strokeWidth={2} />
            Inspect before you pay. No refunds after payment.
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
