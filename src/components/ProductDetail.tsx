"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Droplets,
  Leaf,
  Minus,
  Plus,
  Recycle,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, discountPct } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import ProductCard from "@/components/ProductCard";

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

export default function ProductDetail({ product, related }: ProductDetailProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "One Size");
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const discount = discountPct(product.mrp ?? product.price, product.price);
  const stock = product.stock;
  const maxQty = stock > 0 ? Math.min(stock, 10) : 10;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        image: product.images[0] ?? "/images/products/tee-mist.svg",
        price: product.price,
        size,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const features = [
    { icon: Truck, text: "Free shipping above ₹999 · UPI payments" },
    { icon: Recycle, text: "Plastic-free, recyclable packaging" },
    { icon: ShieldCheck, text: "Easy 7-day returns" },
    { icon: Leaf, text: "One tree planted per order" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-ink/50">
        <Link href="/" className="hover:text-forest">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-forest">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/80">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl bg-mist">
            <Image
              src={
                product.images[selectedImage] ?? product.images[0] ?? "/images/products/tee-mist.svg"
              }
              alt={product.name}
              width={720}
              height={840}
              priority
              className="aspect-[6/7] w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`overflow-hidden rounded-xl border-2 ${
                    i === selectedImage ? "border-forest" : "border-mist"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${i + 1}`}
                    width={96}
                    height={112}
                    className="aspect-[6/7] w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.badge && (
            <span className="inline-block rounded-full bg-seafoam px-3 py-1 text-xs font-semibold text-forest">
              {product.badge}
            </span>
          )}
          <h1 className="display mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-ink/50">({product.reviews} reviews)</span>
            </div>
            {discount > 0 && (
              <span className="text-sm font-semibold text-forest">
                {discount}% off
              </span>
            )}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-4xl font-bold text-forest">
              {formatINR(product.price)}
            </p>
            {product.mrp && product.mrp > product.price && (
              <p className="text-lg text-ink/40 line-through">
                {formatINR(product.mrp)}
              </p>
            )}
          </div>
          <p className="mt-1 text-xs text-ink/50">
            MRP inclusive of all taxes
          </p>

          <p className="mt-6 leading-relaxed text-ink/75">
            {product.description}
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Select size</p>
              <button className="text-xs text-forest hover:underline">
                Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                    size === s
                      ? "border-forest bg-forest text-white"
                      : "border-mist-deep text-ink/70 hover:border-forest"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-mist-deep">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-ink/60 hover:text-forest"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                className="p-3 text-ink/60 hover:text-forest"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-colors ${
                added
                  ? "bg-forest-dark"
                  : "bg-forest hover:bg-forest-dark"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to cart
                </>
              )}
            </button>
          </div>

          {stock <= 20 && stock > 0 && (
            <p className="mt-3 text-xs font-medium text-amber-600">
              Hurry — only {stock} left in stock
            </p>
          )}
          {stock === 0 && (
            <p className="mt-3 text-xs font-medium text-red-500">
              Out of stock
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-ink/70">
                <Icon className="h-4 w-4 shrink-0 text-forest" />
                {text}
              </div>
            ))}
          </div>

          {product.sustainability.length > 0 && (
            <div className="mt-8 rounded-2xl bg-seafoam/60 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-forest">
                <Droplets className="h-4 w-4" /> Sustainability
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sustainability.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-forest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-hand -rotate-2 text-2xl text-forest">
              keep exploring
            </span>
            <h2 className="display mt-1 text-3xl font-extrabold text-ink">
              You may also like
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden rounded-full border border-mist-deep px-5 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-forest hover:text-forest sm:inline-block"
          >
            View all
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}