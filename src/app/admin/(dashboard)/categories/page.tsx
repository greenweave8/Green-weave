import { getCategories } from "@/lib/db";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoriesManager categories={categories} />;
}