import { notFound } from "next/navigation";
import { getAdminRental } from "@/lib/adminRentalsData";
import { updateRental } from "@/lib/actions/rentals";
import RentalForm from "@/components/admin/RentalForm";

export default async function EditRentalPage({ params }: { params: { id: string } }) {
  const rental = await getAdminRental(params.id);
  if (!rental) notFound();

  const boundAction = updateRental.bind(null, params.id);

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
        Edit rental
      </h1>
      <RentalForm action={boundAction} rental={rental} />
    </div>
  );
}
