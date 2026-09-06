"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { formatINR } from "@/lib/format";

export default function ProductsManager({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "Uncategorised";

  const filtered = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : products;

  async function remove(id: string) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete product");
    }
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="display text-3xl font-extrabold text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink/60">
            {products.length} products in your catalogue
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-dark"
        >
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-mist bg-white px-4">
        <Search className="h-4 w-4 text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-mist-deep py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-ink/30" />
          <p className="mt-3 font-semibold text-ink">No products found</p>
          <p className="mt-1 text-sm text-ink/60">
            Try a different search or add a new product.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-mist bg-white">
          <div className="hidden grid-cols-[1fr_180px_120px_140px_120px] gap-4 border-b border-mist bg-mist/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink/50 md:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Category</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_1fr] items-center gap-4 border-b border-mist px-5 py-4 last:border-0 md:grid-cols-[1fr_180px_120px_140px_120px]"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.images[0] ?? "/images/products/tee-mist.svg"}
                  alt={product.name}
                  width={48}
                  height={56}
                  className="aspect-[6/7] w-12 rounded-lg object-cover"
                />
                <div>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium text-ink hover:text-forest"
                  >
                    {product.name}
                  </Link>
                  {product.badge && (
                    <p className="text-xs text-forest">{product.badge}</p>
                  )}
                </div>
              </div>
              <p className="font-semibold text-forest">
                {formatINR(product.price)}
                {product.mrp && product.mrp > product.price && (
                  <span className="ml-1 text-xs text-ink/40 line-through">
                    {formatINR(product.mrp)}
                  </span>
                )}
              </p>
              <p className={product.stock <= 20 ? "font-medium text-amber-600" : "text-ink/70"}>
                {product.stock}
              </p>
              <p className="hidden text-sm text-ink/60 md:block">
                {categoryName(product.categoryId)}
              </p>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink/70 hover:text-forest"
                  aria-label={`Edit ${product.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => remove(product.id)}
                  disabled={deleting === product.id}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50"
                  aria-label={`Delete ${product.name}`}
                >
                  {deleting === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}