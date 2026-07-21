import { getSiteStats } from "@/lib/adminData";
import { updateSiteStats } from "@/lib/actions/siteStats";
import SubmitButton from "@/components/admin/SubmitButton";
import formStyles from "@/components/admin/ListingForm.module.css";

export default async function AdminSettingsPage() {
  const stats = await getSiteStats();

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>
        Settings
      </h1>
      <p style={{ color: "#6b756e", marginBottom: "var(--space-6)", maxWidth: "60ch" }}>
        Items sold and transactions on the homepage are counted automatically
        from real sales. Satisfied customers has no feedback system yet, so
        it's a number you update yourself as you hear from happy buyers and
        sellers.
      </p>

      <form action={updateSiteStats} className={formStyles.form}>
        <section className={formStyles.section}>
          <label className={formStyles.label}>
            Satisfied customers
            <input
              name="satisfied_customers"
              type="number"
              min="0"
              defaultValue={stats.satisfiedCustomers}
              className={formStyles.input}
            />
          </label>
        </section>
        <div className={formStyles.actions}>
          <SubmitButton>Save</SubmitButton>
        </div>
      </form>
    </div>
  );
}
