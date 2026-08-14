import { getMerchCategories } from "@/lib/merch";
import { createMerchProduct } from "@/lib/actions/merch";
import MerchProductForm from "@/components/admin/MerchProductForm";

export default async function NewMerchProductPage() {
  const categories = await getMerchCategories();
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>New product</h1>
      <MerchProductForm action={createMerchProduct} categories={categories} />
    </div>
  );
}
