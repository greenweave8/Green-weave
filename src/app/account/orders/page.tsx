import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { getSessionUser } from "@/lib/user";
import { getOrders } from "@/lib/db";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders",
};

export default async function MyOrdersPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login?next=/account/orders");
  }

  const allOrders = await getOrders();
  const orders = allOrders
    .filter(
      (o) =>
        o.userId === session.user.id ||
        o.customer.email.toLowerCase() === session.user.email
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="font-hand -rotate-2 text-2xl text-forest">
          all your things, one place
        </span>
        <h1 className="display mt-1 text-4xl font-extrabold text-ink sm:text-5xl">
          My orders
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-ink/60">
          Signed in as <span className="font-semibold text-ink">{session.user.email}</span>
        </p>
      </div>

      <div className="mt-10">
        {orders.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-mist bg-white p-12 text-center shadow-sm">
            <PackageSearch className="h-14 w-14 text-forest" />
            <h2 className="mt-4 text-lg font-bold text-ink">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              Orders placed with this account will show up here so you can
              track them any time.
            </p>
            <Link
              href="/shop"
              className="mt-6 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white hover:bg-forest-dark"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isPaid = order.paymentStatus === "paid";
              return (
                <Link
                  key={order.id}
                  href={`/order/${order.id}`}
                  className="block rounded-3xl border border-mist bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-ink">{order.id}</p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-forest">
                        {formatINR(order.total)}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          isPaid
                            ? "bg-seafoam text-forest"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {isPaid
                          ? order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)
                          : "Payment pending"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2.5">
                    {order.items.slice(0, 4).map((item) => (
                      <Image
                        key={`${item.productId}-${item.size}`}
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={56}
                        className="aspect-[6/7] w-12 rounded-lg object-cover"
                      />
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-xs font-medium text-ink/50">
                        +{order.items.length - 4} more
                      </span>
                    )}
                    <p className="ml-auto text-xs text-ink/50">
                      {order.items.reduce((sum, i) => sum + i.qty, 0)} items
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}