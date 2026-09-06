"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  LogOut,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh]">
      <aside className="hidden w-60 shrink-0 border-r border-mist bg-white md:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src="/greenweave-logo.jpeg"
                alt="Greenweave logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-bold text-ink">Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-forest text-white"
                    : "text-ink/70 hover:bg-mist"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-mist"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 bg-cream">
        <div className="flex items-center justify-between border-b border-mist bg-white px-6 py-4 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src="/greenweave-logo.jpeg"
                alt="Greenweave logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-bold text-ink">Admin</span>
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-mist px-4 py-2 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto border-b border-mist bg-white px-4 py-3 md:hidden">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                pathname.startsWith(href)
                  ? "bg-forest text-white"
                  : "bg-mist text-ink/70"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}