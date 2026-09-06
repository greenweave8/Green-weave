"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

interface ShopClientProps {
  products: Product[];
  categories: Category[];
  initialCategory: string;
}

export default function ShopClient({
  products,
  categories,
  initialCategory,
}: ShopClientProps) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState<Sort>("featured");
  const [onSale, setOnSale] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return { min: 0, max: Math.max(...prices, 3000) };
  }, [products]);

  const activeMax = maxPrice || priceBounds.max;

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.categoryId === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sustainability.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (onSale) list = list.filter((p) => (p.mrp ?? p.price) > p.price);
    list = list.filter((p) => p.price <= activeMax);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [products, category, query, onSale, activeMax, sort]);

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/60">
          Category
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => setCategory("")}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
              category === ""
                ? "bg-forest font-semibold text-white"
                : "text-ink/70 hover:bg-mist"
            }`}
          >
            All products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                category === cat.id
                  ? "bg-forest font-semibold text-white"
                  : "text-ink/70 hover:bg-mist"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/60">
          Price up to
        </h3>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={100}
          value={activeMax}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-forest"
        />
        <p className="mt-1 text-xs text-ink/60">
          Showing items under ₹{activeMax.toLocaleString("en-IN")}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={onSale}
          onChange={(e) => setOnSale(e.target.checked)}
          className="h-4 w-4 rounded accent-forest"
        />
        On sale only
      </label>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-hand -rotate-2 text-2xl text-forest">
            the whole collection
          </span>
          <h1 className="display mt-1 text-4xl font-extrabold text-ink sm:text-5xl">
            Shop the grove
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            {products.length} sustainable pieces ·{" "}
            {filtered.length === products.length
              ? `showing all`
              : `${filtered.length} shown`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-full border border-mist bg-white px-4 py-1 shadow-sm sm:flex-none">
            <Search className="h-4 w-4 text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organic cotton…"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-mist bg-white px-4 py-2.5 text-sm outline-none shadow-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2.5 text-sm shadow-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-mist bg-white p-5">
            {filters}
          </div>
        </aside>

        {showFilters && (
          <div className="rounded-2xl border border-mist bg-white p-5 lg:hidden">
            {filters}
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-mist-deep py-20 text-center">
              <p className="text-lg font-semibold text-ink">
                No pieces match those filters
              </p>
              <p className="mt-1 text-sm text-ink/60">
                Try widening your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}