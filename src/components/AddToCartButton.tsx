"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  className?: string;
}

export default function AddToCartButton({
  productId,
  name,
  image,
  price,
  size,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem({ productId, name, image, price, size })}
      className={`group/btn inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-forest-dark hover:shadow-md hover:shadow-forest/20 ${className}`}
    >
      <ShoppingBag className="h-4 w-4 transition-transform group-hover/btn:-rotate-6" />
      Add to cart
    </button>
  );
}