import { getProducts, getCategories } from "@/lib/db";
import { getContent } from "@/lib/content";
import ShopClient from "@/components/ShopClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await getContent();
  return { title: content["shop.title"] };
}

export default async function ShopPage(props: PageProps<"/shop">) {
  const params = (await props.searchParams) ?? {};
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getContent(),
  ]);
  const initialCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category ?? "";

  return (
    <ShopClient
      products={products}
      categories={categories}
      initialCategory={initialCategory}
      copy={{
        eyebrow: content["shop.eyebrow"],
        title: content["shop.title"],
        searchPlaceholder: content["shop.searchPlaceholder"],
        emptyTitle: content["shop.emptyTitle"],
        emptyText: content["shop.emptyText"],
      }}
    />
  );
}