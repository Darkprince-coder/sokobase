import { getCategories } from "@/lib/listings";
import { createListing } from "@/lib/actions/listings";
import ListingForm from "@/components/admin/ListingForm";

export default async function NewListingPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
        New listing
      </h1>
      <ListingForm action={createListing} categories={categories} />
    </div>
  );
}
