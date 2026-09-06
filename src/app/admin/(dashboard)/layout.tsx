import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const store = await cookies();
  if (store.get("gw_admin")?.value !== "authenticated") {
    redirect("/admin/login");
  }
  return <AdminShell>{children}</AdminShell>;
}