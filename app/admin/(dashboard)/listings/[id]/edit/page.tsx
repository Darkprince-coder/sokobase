import { notFound } from "next/navigation";
import { getCategories } from "@/lib/listings";
import { getAdminListing } from "@/lib/adminData";
import { updateListing } from "@/lib/actions/listings";
import ListingForm from "@/components/admin/ListingForm";

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const [categories, listing] = await Promise.all([
    getCategories(),
    getAdminListing(params.id),
  ]);

  if (!listing) notFound();

  const boundAction = updateListing.bind(null, params.id);

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
        Edit listing
      </h1>
      <ListingForm action={boundAction} categories={categories} listing={listing} />
    </div>
  );
}
