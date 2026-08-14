import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import MerchOrderPanel from "@/components/store/MerchOrderPanel";
import Reveal from "@/components/motion/Reveal";
import { getMerchProductBySlug } from "@/lib/merch";
import { formatPrice } from "@/lib/format";
import styles from "@/app/(site)/listings/[slug]/listing.module.css";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getMerchProductBySlug(params.slug);
  if (!product) return {};
  return { title: product.name, description: product.description.slice(0, 155) };
}

export default async function MerchProductPage({ params }: Props) {
  const product = await getMerchProductBySlug(params.slug);
  if (!product) notFound();

  const pageUrl = `https://sokobase.co.ke/store/products/${product.slug}`;

  return (
    <main className="container">
      <div className={styles.layout}>
        <Reveal>
          <ImageGallery images={product.images} alt={product.name} />
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={`price-tag ${styles.price}`}>{formatPrice(product.price)}</p>

          <div className={styles.description}>
            <h2 className={styles.sectionLabel}>Description</h2>
            <p>{product.description}</p>
          </div>

          <MerchOrderPanel product={product} pageUrl={pageUrl} />
        </Reveal>
      </div>
    </main>
  );
}
