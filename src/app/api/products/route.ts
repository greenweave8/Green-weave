import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getProducts,
  insertProduct,
} from "@/lib/db";
import type { Product } from "@/lib/types";
import { uid, slugify } from "@/lib/format";
import { isAuthenticatedToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Product>;
  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const product: Product = {
    id: uid("p"),
    name,
    slug: slugify(name),
    categoryId: body.categoryId ?? "",
    price: Number(body.price) || 0,
    mrp: body.mrp ? Number(body.mrp) : undefined,
    description: body.description?.trim() || "",
    sustainability: Array.isArray(body.sustainability)
      ? body.sustainability.filter(Boolean)
      : [],
    images: Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : ["/images/products/tee-mist.svg"],
    sizes: Array.isArray(body.sizes) && body.sizes.length > 0
      ? body.sizes
      : ["S", "M", "L", "XL"],
    colors: Array.isArray(body.colors) ? body.colors : [],
    rating: Number(body.rating) || 0,
    reviews: Number(body.reviews) || 0,
    stock: Number(body.stock) || 0,
    featured: Boolean(body.featured),
    badge: body.badge?.trim() || undefined,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  await insertProduct(product);
  return NextResponse.json({ product }, { status: 201 });
}