import Link from "next/link";
import { getAdminRequests } from "@/lib/adminData";
import {
  deleteRequest,
  markRequestFulfilled,
  reopenRequest,
} from "@/lib/actions/requests";
import { formatPrice, whatsappLink } from "@/lib/format";
import DeleteListingButton from "@/components/admin/DeleteListingButton";
import RequestStatusAction from "@/components/admin/RequestStatusAction";
import styles from "../listings/listings.module.css";

export default async function AdminRequestsPage() {
  const requests = await getAdminRequests();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Client requests</h1>
        <Link href="/admin/requests/new" className={styles.newButton}>
          + New request
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className={styles.empty}>
          No requests yet.{" "}
          <Link href="/admin/requests/new">Add one from a WhatsApp chat</Link>.
        </p>
      ) : (
        <div className={styles.list}>
          {requests.map((req) => (
            <div key={req.id} className={styles.row} style={{ gridTemplateColumns: "1fr" }}>
              <div className={styles.info}>
                <div className={styles.infoTop}>
                  <span className={styles.itemTitle}>{req.product_title}</span>
                  <span
                    className={
                      req.status === "open" ? "status-reserved" : "status-available"
                    }
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    {req.status === "open" ? "Open" : "Fulfilled"}
                  </span>
                </div>
                <div className={styles.infoMeta}>
                  {req.budget != null && (
                    <span className="price-tag">Budget: {formatPrice(req.budget)}</span>
                  )}
                  {req.request_contact && (
                    <span>
                      {req.request_contact.requester_name} &middot;{" "}
                      {req.request_contact.requester_phone}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                {req.request_contact && (
                  <a
                    href={whatsappLink(
                      `Hi ${req.request_contact.requester_name}, this is SokoBase — we might have found a match for the ${req.product_title} you requested.`
                    )}
                    className={styles.sellLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message on WhatsApp
                  </a>
                )}
                <Link href={`/admin/requests/${req.id}/edit`} className={styles.editLink}>
                  Edit
                </Link>
                <RequestStatusAction
                  id={req.id}
                  status={req.status}
                  onFulfill={markRequestFulfilled}
                  onReopen={reopenRequest}
                />
                <DeleteListingButton
                  id={req.id}
                  title={req.product_title}
                  action={deleteRequest}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
