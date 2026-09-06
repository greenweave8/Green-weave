"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatINR } from "@/lib/format";

const statusOptions: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusStyles: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-50 text-amber-600",
  confirmed: "bg-mist text-ink/70",
  shipped: "bg-blue-50 text-blue-600",
  delivered: "bg-seafoam text-forest",
  cancelled: "bg-red-50 text-red-600",
};

export default function OrdersManager({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function patch(id: string, body: Record<string, unknown>) {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setUpdating(null);
    router.refresh();
  }

  async function updateStatus(id: string, status: OrderStatus) {
    await patch(id, { orderStatus: status });
  }

  async function confirmPayment(id: string) {
    await patch(id, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      verificationVerified: true,
    });
  }

  return (
    <div>
      <h1 className="display text-3xl font-extrabold text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink/60">
        {orders.length} orders placed · confirm payment once received via UPI.
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-mist-deep py-20 text-center">
          <p className="font-semibold text-ink">No orders yet</p>
          <p className="mt-1 text-sm text-ink/60">
            Orders placed on your store will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-mist bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{order.id}</p>
                  <p className="text-xs text-ink/50">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.orderStatus]}`}
                  >
                    {order.orderStatus}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      order.paymentStatus === "paid"
                        ? "bg-seafoam text-forest"
                        : "bg-mist text-ink/60"
                    }`}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    UPI · {order.paymentStatus}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      order.verificationVerified
                        ? "bg-seafoam text-forest"
                        : order.verificationSentAt
                        ? "bg-blue-50 text-blue-600"
                        : "bg-mist text-ink/40"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {order.verificationVerified
                      ? "Verified"
                      : order.verificationSentAt
                      ? "Mail sent"
                      : "Not verified"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {order.items.slice(0, 5).map((item) => (
                    <Image
                      key={`${item.productId}-${item.size}`}
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={47}
                      title={`${item.name} (${item.size}) ×${item.qty}`}
                      className="aspect-[6/7] w-10 rounded-lg object-cover"
                    />
                  ))}
                  {order.items.length > 5 && (
                    <span className="text-xs text-ink/50">
                      +{order.items.length - 5} more
                    </span>
                  )}
                  <span className="text-sm text-ink/60">
                    {order.items.reduce((sum, i) => sum + i.qty, 0)} items
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-forest">
                    {formatINR(order.total)}
                  </p>
                  <p className="text-xs text-ink/50">inclusive of shipping</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-mist pt-4">
                <div className="text-sm text-ink/70">
                  <p className="font-medium text-ink">
                    {order.customer.name} · {order.customer.phone}
                  </p>
                  <p>
                    {order.customer.address}, {order.customer.city},{" "}
                    {order.customer.state} - {order.customer.pincode}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {order.paymentStatus !== "paid" && (
                    <button
                      onClick={() => confirmPayment(order.id)}
                      disabled={updating === order.id}
                      className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-60"
                    >
                      <Banknote className="h-4 w-4" /> Verify &amp; confirm
                    </button>
                  )}
                  <label className="flex items-center gap-2 text-sm">
                    <span className="text-ink/60">Status:</span>
                    <select
                      value={order.orderStatus}
                      disabled={updating === order.id}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="rounded-xl border border-mist-deep px-3 py-2 text-sm outline-none focus:border-forest disabled:opacity-60"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                    {updating === order.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-forest" />
                    )}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}