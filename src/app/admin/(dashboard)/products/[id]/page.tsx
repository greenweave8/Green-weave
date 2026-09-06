import { notFound } from "next/navigation";
import { getCategories, getProductById } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]">
) {
  const { id } = await props.params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);
  if (!product) notFound();

  return <ProductForm categories={categories} product={product} />;
}