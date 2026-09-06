"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useUser } from "@/components/auth/UserProvider";
import { formatINR } from "@/lib/format";
import type { CustomerInfo, Order, OrderItem } from "@/lib/types";

const upiApps = [
  { name: "Google Pay", hint: "GPay" },
  { name: "PhonePe", hint: "@ybl" },
  { name: "Paytm", hint: "@paytm" },
  { name: "BHIM UPI", hint: "UPI handle" },
];

const SHIPPING_FREE_ABOVE = 999;
const SHIPPING_FEE = 99;

export default function CheckoutPage() {
  const { items, clearCart, subtotal } = useCart();
  const { user } = useUser();

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [verifyState, setVerifyState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [verifyMessage, setVerifyMessage] = useState("");

  const shipping =
    subtotal === 0 || subtotal >= SHIPPING_FREE_ABOVE ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  function updateField(field: keyof CustomerInfo, value: string) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  async function completeOrder() {
    if (!placedOrder) return;
    setVerifyState("sending");
    setVerifyMessage("");
    try {
      const res = await fetch(
        `/api/orders/${placedOrder.id}/verify-request`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok) {
        setVerifyState("error");
        setVerifyMessage(data.error ?? "Could not send the mail.");
        return;
      }
      setVerifyState("sent");
      setVerifyMessage(
        data.message ??
          "Verification mail sent to the store. Your order will be finalised once it's verified."
      );
    } catch {
      setVerifyState("error");
      setVerifyMessage("Network error while sending the mail. Please retry.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: items.map(
            (item): OrderItem => ({
              productId: item.productId,
              name: item.name,
              image: item.image,
              size: item.size,
              qty: item.qty,
              price: item.price,
            })
          ),
          paymentMethod: "upi",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setPlacing(false);
        return;
      }
      setPlacedOrder(data.order as Order);
      clearCart();
    } catch {
      setError("Network error. Please try again.");
      setPlacing(false);
    }
  }

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-seafoam text-forest">
            <QrCode className="h-7 w-7" />
          </span>
          <span className="mt-4 inline-block font-hand -rotate-2 text-2xl text-forest">
            almost done
          </span>
          <h1 className="display mt-1 text-4xl font-extrabold text-ink">
            Scan &amp; pay
          </h1>
          <p className="mt-2 text-ink/60">
            Your order{" "}
            <span className="font-semibold text-ink">{placedOrder.id}</span> is
            reserved. Pay using any UPI app to confirm it.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-mist bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-mist pb-4">
            <div>
              <p className="text-sm text-ink/60">Amount to pay</p>
              <p className="display text-3xl font-extrabold text-forest">
                {formatINR(placedOrder.total)}
              </p>
            </div>
            <span className="rounded-full bg-seafoam px-3 py-1 text-xs font-semibold text-forest">
              Greenweave UPI
            </span>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="rounded-2xl border-2 border-dashed border-mist-deep bg-white p-4 shadow-inner">
              <Image
                src="/qr-code.jpeg"
                alt="UPI payment QR code"
                width={260}
                height={260}
                unoptimized
                className="h-60 w-60 object-contain"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {upiApps.map((app) => (
              <div
                key={app.name}
                className="rounded-2xl border border-mist bg-mist/40 p-3 text-center"
              >
                <p className="text-sm font-bold text-ink">{app.name}</p>
                <p className="mt-0.5 text-xs text-ink/50">{app.hint}</p>
              </div>
            ))}
          </div>

          <ol className="mt-6 space-y-2 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-forest">1.</span> Open any UPI app and
              scan the QR code above.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-forest">2.</span> Pay the exact amount
              to the Greenweave account.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-forest">3.</span> Tap{" "}
              <strong>&quot;Complete order&quot;</strong> below so we&apos;re
              notified to verify your payment.
            </li>
          </ol>

          <p className="mt-5 flex items-center gap-1.5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Your order is only counted as valid once the store verifies your
            payment.
          </p>
        </div>

        {verifyState === "sent" ? (
          <div className="mt-6 rounded-3xl border border-seafoam bg-seafoam/30 p-5 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-forest" />
            <p className="mt-3 text-sm font-semibold text-forest">
              Verification mail sent
            </p>
            <p className="mt-1 text-sm text-ink/70">
              The store has been notified. We&apos;ll confirm your order once
              payment is verified.
            </p>
          </div>
        ) : verifyState === "error" ? (
          <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="text-sm font-semibold text-red-600">
              Couldn&apos;t complete the order
            </p>
            <p className="mt-1 text-sm text-ink/70">{verifyMessage}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={completeOrder}
            disabled={verifyState === "sending"}
            className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 transition-all hover:bg-forest-dark disabled:opacity-60"
          >
            {verifyState === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending verification…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Complete order
              </>
            )}
          </button>
          <Link
            href={`/order/${placedOrder.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-mist-deep px-6 py-3.5 text-sm font-semibold text-ink/70 hover:border-forest hover:text-forest"
          >
            Track this order <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-mist-deep px-6 py-3.5 text-sm font-semibold text-ink/70 hover:border-forest hover:text-forest"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <Lock className="mx-auto h-12 w-12 text-ink/30" />
        <h1 className="display mt-6 text-3xl font-extrabold text-ink">
          Nothing to check out
        </h1>
        <p className="mt-2 text-ink/60">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 hover:bg-forest-dark"
        >
          Browse products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="font-hand -rotate-2 text-2xl text-forest">
        almost there
      </span>
      <h1 className="display mt-1 text-4xl font-extrabold text-ink">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-8">
          <section className="rounded-3xl border border-mist bg-white p-6 shadow-sm">
            <h2 className="display text-xl font-extrabold text-ink">
              Delivery details
            </h2>
            {user ? (
              <p className="mt-2 rounded-full bg-seafoam px-4 py-2 text-xs font-medium text-forest">
                Checking out as {user.email} — this order will appear in your
                account.
              </p>
            ) : (
              <p className="mt-2 rounded-full bg-mist px-4 py-2 text-xs font-medium text-ink/60">
                <Link href="/login?next=/checkout" className="font-semibold text-forest hover:underline">
                  Sign in
                </Link>{" "}
                to keep this order in your account for tracking.
              </p>
            )}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Full name", "text"],
                  ["email", "Email", "email"],
                  ["phone", "Phone", "tel"],
                ] as const
              ).map(([field, label, type]) => (
                <div key={field}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    value={customer[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="mt-1.5 w-full rounded-full border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                  Address
                </label>
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="mt-1.5 w-full rounded-3xl border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                  City
                </label>
                <input
                  required
                  value={customer.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="mt-1.5 w-full rounded-full border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                  State
                </label>
                <input
                  required
                  value={customer.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="mt-1.5 w-full rounded-full border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                  PIN code
                </label>
                <input
                  required
                  inputMode="numeric"
                  value={customer.pincode}
                  onChange={(e) =>
                    updateField(
                      "pincode",
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="mt-1.5 w-full rounded-full border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-mist bg-white p-6 shadow-sm">
            <h2 className="display text-xl font-extrabold text-ink">
              Pay with UPI
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              After placing your order, scan the Greenweave QR code with any
              UPI app to complete payment.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {upiApps.map((app) => (
                <div
                  key={app.name}
                  className="rounded-2xl border border-mist bg-mist/40 p-3 text-center"
                >
                  <p className="text-sm font-bold text-ink">{app.name}</p>
                  <p className="mt-0.5 text-xs text-ink/50">{app.hint}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/50">
              <ShieldCheck className="h-4 w-4 text-forest" />
              Your order is confirmed and shipped manually once payment is
              received.
            </p>
          </section>
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
                Add {formatINR(SHIPPING_FREE_ABOVE - subtotal)} more for free
                shipping
              </p>
            )}
            <div className="flex justify-between border-t border-mist-deep pt-3 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold text-forest">{formatINR(total)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={placing}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 transition-all hover:bg-forest-dark disabled:opacity-60"
          >
            {placing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" /> Place order
              </>
            )}
          </button>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </form>

      {placing && (
        <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-forest" />
            <h3 className="mt-4 text-lg font-bold text-ink">
              Securing your order…
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}