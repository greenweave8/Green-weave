import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteContent } from "@/lib/content";

export default function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="relative mt-auto bg-forest-night text-seafoam/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative h-9 w-9 overflow-hidden rounded-full bg-seafoam/15">
              <Image
                src="/greenweave-logo.jpeg"
                alt="Greenweave logo"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              greenweave
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-seafoam/60">
            {content["footer.description"]}
          </p>
          <div className="mt-4 flex items-center gap-2 -rotate-1 font-hand text-lg text-seafoam/80">
            <span className="text-base">☘</span> {content["footer.handNote"]}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
            Shop
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-seafoam/60">
            <li>
              <Link href="/shop" className="transition-colors hover:text-seafoam">
                All products
              </Link>
            </li>
            <li>
              <Link href="/shop?category=womenswear" className="hover:text-seafoam">
                Womenswear
              </Link>
            </li>
            <li>
              <Link href="/shop?category=menswear" className="hover:text-seafoam">
                Menswear
              </Link>
            </li>
            <li>
              <Link href="/shop?category=activewear" className="hover:text-seafoam">
                Activewear
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-seafoam/60">
            <li>
              <Link href="/about" className="hover:text-seafoam">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-seafoam">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-seafoam">
                My orders
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-seafoam">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
            Get in touch
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-seafoam/60">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {content["footer.email"]}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {content["footer.phone"]}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {content["footer.location"]}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-seafoam/40 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Greenweave · {content["footer.copyright"]}
          </p>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-white/15 px-2.5 py-1">
              UPI
            </span>
            <span className="rounded-full border border-white/15 px-2.5 py-1">
              Google Pay
            </span>
            <span className="rounded-full border border-white/15 px-2.5 py-1">
              Paytm
            </span>
            <Link href="/admin" className="rounded-full border border-white/15 px-2.5 py-1 hover:border-seafoam/40 hover:text-seafoam">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}