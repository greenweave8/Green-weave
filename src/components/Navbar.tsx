"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { UserRound, Menu, ShoppingBag, X, LogOut } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useUser } from "@/components/auth/UserProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count } = useCart();
  const { user, loading, logout } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-mist/70 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative h-9 w-9 overflow-hidden rounded-full shadow-sm transition-transform group-hover:rotate-6">
            <Image
              src="/greenweave-logo.jpeg"
              alt="Greenweave logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">
            greenweave
          </span>
          <span className="hidden -rotate-3 font-hand text-base text-forest md:inline">
            small batches, big change
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-full px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {user ? (
            <Link
              href="/account/orders"
              title={`Signed in as ${user.name}`}
              className="flex h-10 items-center gap-2 rounded-full bg-seafoam px-3 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
            >
              <UserRound className="h-4 w-4" />
              <span className="max-w-24 truncate">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            !loading && (
              <Link
                href="/login"
                className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink/70 transition-colors hover:text-forest sm:flex"
              >
                <UserRound className="h-4 w-4" />
                Sign in
              </Link>
            )
          )}
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-forest text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-mist-deep text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-mist bg-white px-4 pb-4 pt-2 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-mist"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-2 border-t border-mist" />
          {user ? (
            <>
              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-mist"
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  void logout();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink/80 hover:bg-mist"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-mist"
            >
              Sign in / Create account
            </Link>
          )}
        </div>
      )}
    </header>
  );
}