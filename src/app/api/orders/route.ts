import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOrders, insertOrder, getProducts } from "@/lib/db";
import type { Order, OrderItem, CustomerInfo } from "@/lib/types";
import { uid } from "@/lib/format";
import { isAuthenticatedToken } from "@/lib/auth";
import { getSessionUserFromRequest } from "@/lib/user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const customer = body.customer as CustomerInfo | undefined;
  const items = body.items as OrderItem[] | undefined;
  const paymentMethod = body.paymentMethod as string;

  if (!customer?.name || !customer?.phone || !customer?.address) {
    return NextResponse.json(
      { error: "Please fill your delivery details" },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (paymentMethod !== "upi") {
    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );
  }

  const products = await getProducts();
  let subtotal = 0;
  const validatedItems: OrderItem[] = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const price = product?.price ?? item.price;
    subtotal += price * item.qty;
    return {
      productId: item.productId,
      name: product?.name ?? item.name,
      image: product?.images[0] ?? item.image,
      size: item.size,
      qty: item.qty,
      price,
    };
  });

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const sessionUser = await getSessionUserFromRequest(request);

  const order: Order = {
    id: uid("ORD"),
    customer: sessionUser ? { ...customer, email: sessionUser.email } : customer,
    userId: sessionUser?.id,
    items: validatedItems,
    paymentMethod: "upi",
    paymentStatus: "pending",
    orderStatus: "pending_payment",
    subtotal,
    shipping,
    total,
    createdAt: new Date().toISOString(),
  };

  await insertOrder(order);
  return NextResponse.json({ order }, { status: 201 });
}