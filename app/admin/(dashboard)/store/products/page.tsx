import Link from "next/link";
import { getAdminMerchProducts } from "@/lib/adminMerch";
import { deleteMerchProduct, toggleMerchStock } from "@/lib/actions/merch";
import { formatPrice } from "@/lib/format";
import DeleteListingButton from "@/components/admin/DeleteListingButton";
import MerchStockAction from "@/components/admin/MerchStockAction";
import styles from "../../listings/listings.module.css";

export default async function AdminMerchProductsPage() {
  const products = await getAdminMerchProducts();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Hometown Store — Products</h1>
        <Link href="/admin/store/products/new" className={styles.newButton}>+ New product</Link>
      </div>

      {products.length === 0 ? (
        <p className={styles.empty}>
          No products yet. <Link href="/admin/store/products/new">Add your first one</Link>.
        </p>
      ) : (
        <div className={styles.list}>
          {products.map((p) => (
            <div key={p.id} className={styles.row}>
              <img src={p.images?.[0] || "/brand/logo-mark.svg"} alt="" className={styles.thumb} />
              <div className={styles.info}>
                <div className={styles.infoTop}>
                  <span className={styles.itemTitle}>{p.name}</span>
                  {p.featured && <span className={styles.featuredTag}>Featured</span>}
                  {!p.in_stock && (
                    <span className={styles.featuredTag} style={{ color: "var(--color-danger)" }}>
                      Sold out
                    </span>
                  )}
                  {p.status === "inactive" && <span className={styles.featuredTag}>Hidden</span>}
                </div>
                <div className={styles.infoMeta}>
                  <span className="price-tag">{formatPrice(p.price)}</span>
                  <span>{p.category?.name ?? "Uncategorized"}</span>
                  <span>Stock: {p.stock_count}</span>
                </div>
              </div>
              <div className={styles.actions}>
                <Link href={`/admin/store/products/${p.id}/edit`} className={styles.editLink}>Edit</Link>
                <MerchStockAction id={p.id} inStock={p.in_stock} action={toggleMerchStock} />
                <DeleteListingButton id={p.id} title={p.name} action={deleteMerchProduct} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
