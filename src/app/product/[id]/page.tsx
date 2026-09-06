import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/db";
import ProductDetail from "@/components/ProductDetail";

export const metadata = {
  title: "Product",
};

export const dynamic = "force-dynamic";

export default async function ProductPage(props: PageProps<"/product/[id]">) {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts
    .filter(
      (p) => p.categoryId === product.categoryId && p.id !== product.id
    )
    .slice(0, 4);

  return (
    <ProductDetail
      product={product}
      related={
        related.length > 0
          ? related
          : allProducts.filter((p) => p.id !== product.id).slice(0, 4)
      }
    />
  );
}