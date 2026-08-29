import Link from "next/link";
import { getCategories } from "@/lib/listings";
import { deleteCategory } from "@/lib/actions/categories";
import DeleteListingButton from "@/components/admin/DeleteListingButton";
import listStyles from "../listings/listings.module.css";
import styles from "./categories.module.css";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className={listStyles.header}>
        <h1 className={listStyles.title}>Categories</h1>
        <Link href="/admin/categories/new" className={listStyles.newButton}>
          + New category
        </Link>
      </div>

      <p className={styles.note}>
        These power the category filter on Browse and the category chips on the homepage and
        Hometown Store. Deleting a category never deletes its products &mdash; they just fall
        back to &ldquo;Uncategorized&rdquo;.
      </p>

      {categories.length === 0 ? (
        <p className={listStyles.empty}>
          No categories yet. <Link href="/admin/categories/new">Add your first one</Link>.
        </p>
      ) : (
        <div className={styles.list}>
          {categories.map((cat) => (
            <div key={cat.id} className={styles.row}>
              <div className={styles.info}>
                <span className={styles.name}>{cat.name}</span>
                <span className={styles.slug}>/{cat.slug}</span>
              </div>
              <div className={styles.actions}>
                <Link href={`/admin/categories/${cat.id}/edit`} className={listStyles.editLink}>
                  Edit
                </Link>
                <DeleteListingButton id={cat.id} title={cat.name} action={deleteCategory} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
