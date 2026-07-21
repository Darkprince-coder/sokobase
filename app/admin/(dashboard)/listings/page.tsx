import Link from "next/link";
import { getAdminListings } from "@/lib/adminData";
import { deleteListing, setListingStatus } from "@/lib/actions/listings";
import { formatPrice } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import DeleteListingButton from "@/components/admin/DeleteListingButton";
import StatusQuickAction from "@/components/admin/StatusQuickAction";
import styles from "./listings.module.css";

export default async function AdminListingsPage() {
  const listings = await getAdminListings();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Listings</h1>
        <Link href="/admin/listings/new" className={styles.newButton}>
          + New listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className={styles.empty}>
          No listings yet.{" "}
          <Link href="/admin/listings/new">Create your first one</Link>.
        </p>
      ) : (
        <div className={styles.list}>
          {listings.map((listing) => (
            <div key={listing.id} className={styles.row}>
              <img
                src={listing.images?.[0] || "/brand/logo-mark.svg"}
                alt=""
                className={styles.thumb}
              />

              <div className={styles.info}>
                <div className={styles.infoTop}>
                  <span className={styles.itemTitle}>{listing.title}</span>
                  <StatusBadge status={listing.status} />
                  {listing.featured && <span className={styles.featuredTag}>Featured</span>}
                </div>
                <div className={styles.infoMeta}>
                  <span className="price-tag">{formatPrice(listing.price)}</span>
                  <span>{listing.category?.name ?? "Uncategorized"}</span>
                  <span>{listing.condition}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href={`/admin/listings/${listing.id}/edit`} className={styles.editLink}>
                  Edit
                </Link>
                {listing.status !== "sold" && (
                  <>
                    <StatusQuickAction
                      id={listing.id}
                      status={listing.status}
                      action={setListingStatus}
                    />
                    <Link
                      href={`/admin/listings/${listing.id}/sell`}
                      className={styles.sellLink}
                    >
                      Mark sold
                    </Link>
                  </>
                )}
                <DeleteListingButton
                  id={listing.id}
                  title={listing.title}
                  action={deleteListing}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
