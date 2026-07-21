import SubmitButton from "@/components/admin/SubmitButton";
import type { AdminRequest } from "@/lib/adminData";
import styles from "@/components/admin/ListingForm.module.css";

export default function RequestForm({
  action,
  request,
}: {
  action: (formData: FormData) => Promise<void>;
  request?: AdminRequest;
}) {
  return (
    <form action={action} className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What they&rsquo;re looking for</h2>

        <label className={styles.label}>
          Product
          <input
            name="product_title"
            required
            defaultValue={request?.product_title}
            className={styles.input}
            placeholder="e.g. Queen-size bed frame"
          />
        </label>

        <label className={styles.label}>
          Description
          <textarea
            name="description"
            required
            defaultValue={request?.description}
            className={styles.textarea}
            rows={4}
            placeholder="Any details from the WhatsApp conversation — size, color, preferred condition..."
          />
        </label>

        <label className={styles.label}>
          Budget (KSh) &mdash; optional
          <input
            name="budget"
            type="number"
            min="0"
            defaultValue={request?.budget ?? ""}
            className={styles.input}
            placeholder="Leave blank if they didn't give one"
          />
        </label>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Requester contact (private &mdash; never shown publicly)</h2>
        <div className={styles.row}>
          <label className={styles.label}>
            Name
            <input
              name="requester_name"
              defaultValue={request?.request_contact?.requester_name}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Phone
            <input
              name="requester_phone"
              defaultValue={request?.request_contact?.requester_phone}
              className={styles.input}
              placeholder="0712 345 678"
            />
          </label>
        </div>
      </section>

      <div className={styles.actions}>
        <SubmitButton>{request ? "Save changes" : "Add request"}</SubmitButton>
      </div>
    </form>
  );
}
