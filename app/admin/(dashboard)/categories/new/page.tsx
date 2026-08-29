import { createCategory } from "@/lib/actions/categories";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-6)" }}>
        New category
      </h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
