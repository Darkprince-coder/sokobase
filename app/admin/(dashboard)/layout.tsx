import { redirect } from "next/navigation";
import { createAuthedServerClient } from "@/lib/supabase/authServer";
import AdminNav from "@/components/admin/AdminNav";
import styles from "./dashboard-layout.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createAuthedServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <AdminNav email={user.email ?? ""} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
