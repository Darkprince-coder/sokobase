import { notFound } from "next/navigation";
import { getCategories } from "@/lib/listings";
import { updateCategory } from "@/lib/actions/categories";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const categories = await getCategories();
  const category = categories.find((c) => c.id === params.id);
  if (!category) notFound();

  const boundAction = updateCategory.bind(null, params.id);

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
        Edit category
      </h1>
      <CategoryForm action={boundAction} category={category} />
    </div>
  );
}
