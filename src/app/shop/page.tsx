import { getProducts, getCategories } from "@/lib/db";
import ShopClient from "@/components/ShopClient";

export const metadata = {
  title: "Shop",
};

export const dynamic = "force-dynamic";

export default async function ShopPage(props: PageProps<"/shop">) {
  const params = (await props.searchParams) ?? {};
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const initialCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category ?? "";

  return (
    <ShopClient
      products={products}
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}