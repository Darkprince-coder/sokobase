import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, ListFilter, MessageCircle } from "lucide-react";
import RentalCard from "@/components/RentalCard";
import WhatsAppLink from "@/components/WhatsAppLink";
import Reveal from "@/components/motion/Reveal";
import { getRentals } from "@/lib/rentals";
import { whatsappLink } from "@/lib/format";
import styles from "./rentals.module.css";

export const metadata: Metadata = {
  title: "Rentals",
  description:
    "Houses and business premises for rent, listed by Hometown SokoBase. Real photos, clear pricing, and the details that matter.",
};

const HOUSE_TYPES = [
  "Single Room",
  "Bedsitter",
  "1 Bedroom",
  "2 Bedroom",
  "3 Bedroom+",
  "Shop",
  "Office",
  "Warehouse",
  "Commercial Plot",
  "Other",
];

interface RentalsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    house_type?: string;
    minRent?: string;
    maxRent?: string;
    sort?: string;
  };
}

export default async function RentalsPage({ searchParams }: RentalsPageProps) {
  const { q, category, house_type, minRent, maxRent, sort } = searchParams;

  const rentals = await getRentals({
    q,
    category,
    houseType: house_type,
    minRent: minRent ? Number(minRent) : undefined,
    maxRent: maxRent ? Number(maxRent) : undefined,
    sort: (sort as "newest" | "rent_asc" | "rent_desc") || "newest",
  });

  const notifyLink = whatsappLink(
    "Hi Hometown SokoBase, I have a vacant property I'd like to list for rent."
  );

  const tabs = [
    { value: undefined, label: "All" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
  ];

  return (
    <main className="container">
      <Reveal className={styles.header}>
        <h1 className={styles.title}>Rentals</h1>
        <p className={styles.subtitle}>
          {rentals.length} propert{rentals.length === 1 ? "y" : "ies"} available. Real photos,
          clear pricing, no surprises.
        </p>
      </Reveal>

      <Reveal className={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = (category ?? undefined) === tab.value;
          const href = tab.value ? `/rentals?category=${tab.value}` : "/rentals";
          return (
            <Link
              key={tab.label}
              href={href}
              className={isActive ? styles.tabActive : styles.tab}
            >
              {tab.label}
            </Link>
          );
        })}
      </Reveal>

      <Reveal>
        <form method="get" className={styles.filters}>
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search rentals..."
            className={styles.filterInput}
          />

          <select name="house_type" defaultValue={house_type ?? ""} className={styles.filterSelect}>
            <option value="">Any property type</option>
            {HOUSE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="minRent"
            defaultValue={minRent}
            placeholder="Min KSh/mo"
            className={styles.filterInputSmall}
          />
          <input
            type="number"
            name="maxRent"
            defaultValue={maxRent}
            placeholder="Max KSh/mo"
            className={styles.filterInputSmall}
          />

          <select name="sort" defaultValue={sort ?? "newest"} className={styles.filterSelect}>
            <option value="newest">Newest first</option>
            <option value="rent_asc">Rent: low to high</option>
            <option value="rent_desc">Rent: high to low</option>
          </select>

          <button type="submit" className={styles.filterButton}>
            <ListFilter size={15} strokeWidth={2.2} />
            Apply
          </button>
        </form>
      </Reveal>

      {rentals.length > 0 ? (
        <div className={styles.grid}>
          {rentals.map((rental, i) => (
            <RentalCard key={rental.id} rental={rental} index={i} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <SearchX size={28} strokeWidth={1.5} />
          <p>No rentals match those filters yet. Try widening your search.</p>
        </div>
      )}

      <Reveal className={styles.landlordCta}>
        <p className={styles.landlordText}>Have a property to rent out?</p>
        <WhatsAppLink href={notifyLink} label="rentals_browse_landlord" className={styles.landlordLink}>
          <MessageCircle size={15} strokeWidth={2.2} />
          List it with us on WhatsApp
        </WhatsAppLink>
      </Reveal>
    </main>
  );
}
