import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, Zap, Droplets, MapPin, Info, ZapOff, AlertCircle } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import RentalCard from "@/components/RentalCard";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import { getRentalBySlug, getRelatedRentals } from "@/lib/rentals";
import { formatPrice, whatsappLink } from "@/lib/format";
import styles from "./rental.module.css";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rental = await getRentalBySlug(params.slug);
  if (!rental) return {};

  const description = rental.description.slice(0, 155);

  return {
    title: rental.title,
    description,
    openGraph: {
      title: rental.title,
      description,
      type: "website",
    },
  };
}

export default async function RentalPage({ params }: Props) {
  const rental = await getRentalBySlug(params.slug);
  if (!rental) notFound();

  const related = await getRelatedRentals(rental.house_type, rental.id);
  const pageUrl = `https://sokobase.co.ke/rentals/${rental.slug}`;
  const isAvailable = rental.status === "available";

  const inquireLink = whatsappLink(
    `Hi SokoBase, I'm interested in "${rental.title}" (${pageUrl}). Is it still available?`
  );

  return (
    <main className="container">
      <div className={styles.layout}>
        <Reveal>
          <ImageGallery images={rental.images} alt={rental.title} />
        </Reveal>

        <Reveal delay={0.08} className={styles.info}>
          <div className={styles.badgeRow}>
            <span className={isAvailable ? styles.statusAvailable : styles.statusRented}>
              {isAvailable ? "Available" : "Rented"}
            </span>
            {rental.verified && (
              <span className={styles.verified}>
                <MapPin size={13} strokeWidth={2.2} />
                Inspected
              </span>
            )}
          </div>

          <h1 className={styles.title}>{rental.title}</h1>
          <p className={`price-tag ${styles.price}`}>
            {formatPrice(rental.monthly_rent)}
            <span className={styles.perMonth}>/month</span>
          </p>
          {rental.deposit != null && (
            <p className={styles.deposit}>Deposit: {formatPrice(rental.deposit)}</p>
          )}

          <dl className={styles.specs}>
            <div>
              <dt>Type</dt>
              <dd>{rental.house_type}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{rental.location}</dd>
            </div>
            {rental.distance_to_town && (
              <div>
                <dt>Distance to town</dt>
                <dd>{rental.distance_to_town}</dd>
              </div>
            )}
          </dl>

          <div className={styles.utilities}>
            <span className={rental.has_electricity ? styles.utilityOn : styles.utilityOff}>
              {rental.has_electricity ? (
                <Zap size={14} strokeWidth={2} />
              ) : (
                <ZapOff size={14} strokeWidth={2} />
              )}
              {rental.has_electricity ? "Electricity available" : "No electricity"}
            </span>
            <span className={rental.has_water ? styles.utilityOn : styles.utilityOff}>
              {rental.has_water ? (
                <Droplets size={14} strokeWidth={2} />
              ) : (
                <AlertCircle size={14} strokeWidth={2} />
              )}
              {rental.has_water ? "Water available" : "No running water"}
            </span>
          </div>

          <div className={styles.description}>
            <h2 className={styles.sectionLabel}>Description</h2>
            <p>{rental.description}</p>
          </div>

          {isAvailable ? (
            <WhatsAppLink href={inquireLink} label={`rental_${rental.slug}`} className={styles.cta}>
              <MessageCircle size={17} strokeWidth={2.2} />
              Ask about this house on WhatsApp
            </WhatsAppLink>
          ) : (
            <div className={styles.unavailable}>
              This house has been rented. Check <a href="/rentals">other rentals</a>.
            </div>
          )}

          <p className={styles.notice}>
            <Info size={14} strokeWidth={2} />
            Visit and inspect before agreeing to anything.
          </p>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <Reveal>
            <h2 className={styles.sectionTitle}>Similar rentals</h2>
          </Reveal>
          <div className={styles.relatedGrid}>
            {related.map((item, i) => (
              <RentalCard key={item.id} rental={item} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
