import { createRental } from "@/lib/actions/rentals";
import RentalForm from "@/components/admin/RentalForm";

export default function NewRentalPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
        New rental
      </h1>
      <RentalForm action={createRental} />
    </div>
  );
}
