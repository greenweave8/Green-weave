import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  ClipboardList,
  Package,
  Tags,
} from "lucide-react";
import { getProducts, getCategories, getOrders } from "@/lib/db";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, categories, orders] = await Promise.all([
    getProducts(),
    getCategories(),
    getOrders(),
  ]);

  const revenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 20);
  const recentOrders = orders.slice(0, 5);

  const statCards = [
    {
      icon: Package,
      label: "Products",
      value: products.length,
      href: "/admin/products",
    },
    {
      icon: Tags,
      label: "Categories",
      value: categories.length,
      href: "/admin/categories",
    },
    {
      icon: ClipboardList,
      label: "Orders",
      value: orders.length,
      href: "/admin/orders",
    },
    {
      icon: Banknote,
      label: "Revenue",
      value: formatINR(revenue),
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="display text-3xl font-extrabold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">
        An overview of your store.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-mist bg-white p-5 transition-shadow hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist text-forest">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-2xl font-bold text-ink">{value}</p>
            <p className="text-sm text-ink/60">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-mist bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-ink/50">
              No orders yet. Share your store link to get started!
            </p>
          ) : (
            <div className="mt-4 divide-y divide-mist">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{order.id}</p>
                    <p className="text-xs text-ink/50">
                      {order.customer.name} · {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatINR(order.total)}
                    </p>
                    <p className="text-xs capitalize text-ink/50">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-mist bg-white p-6">
          <h2 className="text-lg font-bold text-ink">Low stock alert</h2>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-ink/50">
              All products are well stocked.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-mist">
              {lowStock.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between py-3 hover:bg-mist/40"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-ink/50">
                      {product.stock} left in stock
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                    {product.stock <= 5 ? "Critical" : "Low"}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/admin/products/new"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-dark"
          >
            Add new product
          </Link>
        </section>
      </div>
    </div>
  );
}