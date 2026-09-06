import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, discountPct } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? "/images/products/tee-mist.svg";
  const discount = discountPct(product.mrp ?? product.price, product.price);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-mist bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/10">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[7/8] overflow-hidden bg-seafoam/30"
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <span className="rounded-full bg-forest px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-forest-dark shadow-sm">
              −{discount}%
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="display text-lg font-semibold leading-tight text-ink">
              <Link
                href={`/product/${product.id}`}
                className="hover:text-forest"
              >
                {product.name}
              </Link>
            </h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-ink/60">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-ink/80">{product.rating}</span>
              <span className="text-ink/40">· {product.reviews}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-forest">
              {formatINR(product.price)}
            </p>
            {product.mrp && product.mrp > product.price && (
              <p className="text-xs text-ink/40 line-through">
                {formatINR(product.mrp)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-mist pt-4">
          <div className="flex gap-1">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="rounded-full border border-mist-deep px-2 py-0.5 text-[10px] font-medium text-ink/60"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-ink/40">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
          <AddToCartButton
            productId={product.id}
            name={product.name}
            image={image}
            price={product.price}
            size={product.sizes[0] ?? "One Size"}
            className="!rounded-full !px-3.5 !py-2"
          />
        </div>
      </div>
    </div>
  );
}