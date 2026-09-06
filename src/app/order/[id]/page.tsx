import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  CreditCard,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { getOrderById } from "@/lib/db";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderPage(props: PageProps<"/order/[id]">) {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const isPaid = order.paymentStatus === "paid";
  const isCancelled = order.orderStatus === "cancelled";
  const isPendingPayment = order.orderStatus === "pending_payment";
  const statusSteps = ["confirmed", "shipped", "delivered"];
  const currentStep = isPaid
    ? statusSteps.indexOf(order.orderStatus)
    : -1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle2
          className={`mx-auto h-16 w-16 ${
            isPaid ? "text-forest" : "text-amber-500"
          }`}
        />
        <h1 className="display mt-4 text-4xl font-extrabold text-ink sm:text-5xl">
          {isCancelled
            ? "Order cancelled"
            : isPendingPayment
            ? "Payment pending"
            : "Thanks for your order!"}
        </h1>
        <p className="mt-2 text-ink/60">
          Order ID: <span className="font-semibold text-ink">{order.id}</span>
        </p>
        {isPendingPayment && (
          <p className="mx-auto mt-4 max-w-md rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-700">
            {order.verificationSentAt && !order.verificationVerified
              ? "A verification mail has been sent to the store. Your order is counted as valid only once the store verifies your payment."
              : "Scan the Greenweave UPI QR code to pay, then complete your order. It is confirmed only after the store verifies your payment."}
          </p>
        )}
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-mist p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Payment
          </p>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm font-bold text-ink">
            <CreditCard className="h-4 w-4 text-forest" /> UPI ·{" "}
            {isPaid ? "Paid" : "Pending"}
          </p>
          {order.paymentId && (
            <p className="mt-1 text-[11px] break-all text-ink/40">
              {order.paymentId}
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-mist p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Total
          </p>
          <p className="mt-2 text-sm font-bold text-forest">
            {formatINR(order.total)}
          </p>
        </div>
        <div className="rounded-2xl border border-mist p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Status
          </p>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm font-bold text-ink">
            <Truck className="h-4 w-4 text-forest" />
            {order.orderStatus.charAt(0).toUpperCase() +
              order.orderStatus.slice(1)}
          </p>
        </div>
        <div className="rounded-2xl border border-mist p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Verification
          </p>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm font-bold text-ink">
            <ShieldCheck className="h-4 w-4 text-forest" />
            {order.verificationVerified
              ? "Verified"
              : order.verificationSentAt
              ? "Mail sent · pending"
              : "Not sent"}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-mist p-6">
        <p className="text-sm font-semibold text-ink">Tracking</p>
        {!isPaid && !isCancelled ? (
          <p className="mt-4 text-sm text-ink/60">
            Tracking will appear here once your payment is verified and the
            order is confirmed.
          </p>
        ) : (
        <ol className="mt-4 space-y-4">
          {statusSteps.map((step, i) => {
            const reached = i <= currentStep;
            return (
              <li key={step} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
                    reached ? "bg-forest text-white" : "bg-mist text-ink/40"
                  }`}
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : reached ? (
                    <PackageCheck className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-ink/30" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold capitalize text-ink">{step}</p>
                  <p className="text-xs text-ink/50">
                    {i === 0 && "Your order is confirmed."}
                    {i === 1 && "On its way to you — smell the fresh paper."}
                    {i === 2 && "Delivered to your door."}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        )}
        {isCancelled && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            This order was cancelled.
          </p>
        )}
      </div>

      <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-mist p-6">
        <p className="text-sm font-semibold text-ink">
          Items ·{" "}
          <span className="font-normal text-ink/50">
            {order.items.reduce((sum, item) => sum + item.qty, 0)} total
          </span>
        </p>
        <div className="mt-4 divide-y divide-mist">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 py-3">
              <Image
                src={item.image}
                alt={item.name}
                width={56}
                height={64}
                className="aspect-[6/7] w-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink/50">
                  Size {item.size} · Qty {item.qty}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatINR(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>
        <dl className="mt-4 space-y-2 border-t border-mist-deep pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/60">Subtotal</dt>
            <dd className="font-semibold">{formatINR(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Shipping</dt>
            <dd className="font-semibold">
              {order.shipping === 0 ? "Free" : formatINR(order.shipping)}
            </dd>
          </div>
          <div className="flex justify-between text-base">
            <dt className="font-bold">Total</dt>
            <dd className="font-bold text-forest">{formatINR(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-mist bg-mist/40 p-6">
        <p className="text-sm font-semibold text-ink">Delivery to</p>
        <p className="mt-2 text-sm text-ink/70">
          {order.customer.name} · {order.customer.phone}
          <br />
          {order.customer.address}
          <br />
          {order.customer.city}, {order.customer.state} -{" "}
          {order.customer.pincode}
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white hover:bg-forest-dark"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}