import { notFound } from "next/navigation";
import { getMerchCategories } from "@/lib/merch";
import { getAdminMerchProduct } from "@/lib/adminMerch";
import { updateMerchProduct } from "@/lib/actions/merch";
import MerchProductForm from "@/components/admin/MerchProductForm";

export default async function EditMerchProductPage({ params }: { params: { id: string } }) {
  const [categories, product] = await Promise.all([
    getMerchCategories(),
    getAdminMerchProduct(params.id),
  ]);
  if (!product) notFound();
  const boundAction = updateMerchProduct.bind(null, params.id);
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>Edit product</h1>
      <MerchProductForm action={boundAction} categories={categories} product={product} />
    </div>
  );
}
