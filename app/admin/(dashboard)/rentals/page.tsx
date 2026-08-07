import Link from "next/link";
import { getAdminRentals } from "@/lib/adminRentalsData";
import { deleteRental, setRentalStatus } from "@/lib/actions/rentals";
import { formatPrice } from "@/lib/format";
import DeleteListingButton from "@/components/admin/DeleteListingButton";
import RentalStatusAction from "@/components/admin/RentalStatusAction";
import styles from "../listings/listings.module.css";

export default async function AdminRentalsPage() {
  const rentals = await getAdminRentals();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Rentals</h1>
        <Link href="/admin/rentals/new" className={styles.newButton}>
          + New rental
        </Link>
      </div>

      {rentals.length === 0 ? (
        <p className={styles.empty}>
          No rentals yet.{" "}
          <Link href="/admin/rentals/new">Add your first vacant house</Link>.
        </p>
      ) : (
        <div className={styles.list}>
          {rentals.map((rental) => (
            <div key={rental.id} className={styles.row}>
              <img
                src={rental.images?.[0] || "/brand/logo-mark.svg"}
                alt=""
                className={styles.thumb}
              />

              <div className={styles.info}>
                <div className={styles.infoTop}>
                  <span className={styles.itemTitle}>{rental.title}</span>
                  <span
                    className={rental.status === "available" ? "status-available" : "status-sold"}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    {rental.status === "available" ? "Available" : "Rented"}
                  </span>
                  {rental.featured && <span className={styles.featuredTag}>Featured</span>}
                </div>
                <div className={styles.infoMeta}>
                  <span className="price-tag">{formatPrice(rental.monthly_rent)}/mo</span>
                  <span>{rental.house_type}</span>
                  <span>{rental.location}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href={`/admin/rentals/${rental.id}/edit`} className={styles.editLink}>
                  Edit
                </Link>
                <RentalStatusAction
                  id={rental.id}
                  status={rental.status}
                  action={setRentalStatus}
                />
                <DeleteListingButton
                  id={rental.id}
                  title={rental.title}
                  action={deleteRental}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
