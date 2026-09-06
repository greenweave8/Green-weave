"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatINR } from "@/lib/format";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mist text-forest">
          <ShoppingBag className="h-9 w-9" />
        </span>
        <h1 className="display mt-6 text-3xl font-extrabold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-2 text-ink/60">
          Fill it with clothes that love the planet back.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 hover:bg-forest-dark"
        >
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="display text-4xl font-extrabold text-ink">
        Shopping cart
      </h1>
      <span className="font-hand -rotate-2 text-xl text-forest">
        good choices in here
      </span>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex gap-4 rounded-2xl border border-mist bg-white p-4"
            >
              <Link
                href={`/product/${item.productId}`}
                className="block shrink-0 overflow-hidden rounded-xl bg-mist"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={112}
                  className="aspect-[6/7] w-24 object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${item.productId}`}
                      className="font-semibold text-ink hover:text-forest"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-ink/50">
                      Size: {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-ink/40 hover:text-red-500"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-mist-deep">
                    <button
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="p-2 text-ink/60 hover:text-forest"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="p-2 text-ink/60 hover:text-forest"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-bold text-forest">
                    {formatINR(item.price * item.qty)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-3xl border border-mist bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="display text-xl font-extrabold text-ink">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="font-semibold">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-forest">Free</span>
                ) : (
                  formatINR(shipping)
                )}
              </dd>
            </div>
            {shipping > 0 && (
              <p className="rounded-lg bg-mist px-3 py-2 text-xs text-ink/60">
                Add {formatINR(999 - subtotal)} more for free shipping
              </p>
            )}
            <div className="flex justify-between border-t border-mist-deep pt-3 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold text-forest">{formatINR(total)}</dd>
            </div>
          </dl>

          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 hover:bg-forest-dark"
          >
            Proceed to checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-ink/50">
            Pay by scanning a UPI QR code
          </p>
        </div>
      </div>
    </div>
  );
}