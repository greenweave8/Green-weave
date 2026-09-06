import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Droplets,
  Leaf,
  Recycle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getProducts, getCategories } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata = {
  title: "Greenweave — Clothes that heal the Earth",
};

export const dynamic = "force-dynamic";

const marqueeItems = [
  "100% organic cotton",
  "recycled ocean plastic",
  "fair trade studios",
  "one tree per order",
  "low-water dyeing",
  "plastic-free packaging",
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = [...products]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);
  const categoryCards = categories.slice(0, 4);

  return (
    <>
      {/* ---- Dramatic dark hero ---- */}
      <section className="relative overflow-hidden bg-forest-night text-seafoam">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-96 w-96 animate-blob bg-forest-deep-2/60 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-[28rem] w-[28rem] animate-blob bg-forest/30 blur-3xl" />
          <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-seafoam/10 blur-2xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex -rotate-1 items-center gap-2 rounded-full bg-seafoam/10 px-4 py-1.5 text-xs font-semibold text-seafoam ring-1 ring-seafoam/20">
              <Sparkles className="h-4 w-4" /> autumn drop 2026 · now live
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Wear your
              <br />
              <span className="text-seafoam">values</span>{" "}
              <span className="italic text-seafoam/70">thread</span>
              <br />by thread.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-seafoam/70">
              Organic cotton, hemp and recycled ocean plastic — cut in small
              batches and stitched with care in Auroville.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-seafoam px-8 py-4 text-sm font-bold text-forest-night transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-seafoam/20"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-seafoam/30 px-8 py-4 text-sm font-semibold text-seafoam transition-colors hover:bg-seafoam/10"
              >
                Our mission
              </Link>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-seafoam/15 pt-8">
              {[
                ["50L", "water saved per piece"],
                ["120k", "bottles recycled"],
                ["1:1", "trees planted"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="display text-3xl font-black text-seafoam">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-seafoam/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 -rotate-3 animate-blob rounded-[40%_60%_60%_40%/50%_40%_60%_50%] bg-gradient-to-br from-seafoam/20 to-forest/30" />
            <div className="relative animate-float">
              <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-seafoam/30 to-forest/40 p-2 shadow-2xl shadow-black/40 ring-1 ring-seafoam/20">
                <Image
                  src="/images/products/hoodie-seafoam.svg"
                  alt="Greenweave sustainable hoodie"
                  width={520}
                  height={620}
                  priority
                  className="w-full rounded-[2rem]"
                />
              </div>
            </div>
            <div className="absolute -left-6 top-10 rotate-[-4deg] rounded-2xl bg-white/95 px-5 py-3 font-hand text-lg text-forest-night shadow-lg">
              feels as good
              <br />
              as it does good ☘
            </div>
            <div className="absolute -right-4 bottom-12 rotate-[3deg] rounded-2xl bg-seafoam px-5 py-3 font-hand text-lg text-forest-night shadow-lg">
              2,400 trees planted this week 🌱
            </div>
          </div>
        </div>

        <div className="relative border-t border-seafoam/10 bg-forest-night/80">
          <div className="flex overflow-hidden py-4">
            <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 whitespace-nowrap text-sm font-medium uppercase tracking-widest text-seafoam/60"
                >
                  {item}
                  <span className="text-forest">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Value pillars ---- */}
      <section className="border-b border-mist bg-sand/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <span className="font-hand -rotate-2 text-2xl text-forest">
              why greenweave
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
              Better for you, better for Earth
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Leaf,
                title: "Organic fibres",
                text: "GOTS-certified cotton, hemp and bamboo — no pesticides, no GMOs.",
              },
              {
                icon: Droplets,
                title: "Low-water dyeing",
                text: "Up to 40% less water and zero toxic runoff into rivers.",
              },
              {
                icon: Recycle,
                title: "Circular by design",
                text: "Recycled bottles and regenerated fabrics in every drop.",
              },
              {
                icon: ShieldCheck,
                title: "Fair & ethical",
                text: "Fair-trade wages in transparent, safe workplaces.",
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className={`group rounded-3xl border border-mist bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg rotate-[${
                  i % 2 === 0 ? "-0.5deg" : "0.5deg"
                }]`}
              >
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-seafoam p-3 text-forest transition-transform group-hover:rotate-6">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="display mt-5 text-xl font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Bestsellers ---- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-hand -rotate-2 text-2xl text-forest">
              crowd favourites
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
              You&apos;ll love the feel
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ---- Shop by category ---- */}
      <section className="relative overflow-hidden bg-forest-night py-20 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-forest/30 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-forest-deep-2/60 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <span className="font-hand -rotate-2 text-2xl text-seafoam">
              find your staple
            </span>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Shop by category
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((category, i) => {
              const image =
                products.find((p) => p.categoryId === category.id)?.images[0] ??
                "/images/products/tee-mist.svg";
              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className={`group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:bg-white/10 ${
                    i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
                  }`}
                >
                  <div className="aspect-[4/5] w-full">
                    <Image
                      src={image}
                      alt={category.name}
                      width={480}
                      height={600}
                      className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-night/90 to-transparent p-5">
                    <h3 className="display text-xl font-semibold text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-seafoam/80">
                      Shop now <ArrowRight className="h-4 w-4" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Impact banner ---- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-seafoam p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/50" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/40" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="font-hand -rotate-2 text-2xl text-forest">
                our promise
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-forest-night sm:text-4xl">
                One tree planted for every order
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-forest-night/70">
                We partner with grassroots reforestation groups across India.
                Your purchase funds a tree — and our recycled paper packaging
                means the only thing we send out is good clothes.
              </p>
              <Link
                href="/about"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-forest-night px-8 py-4 text-sm font-bold text-seafoam transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Read our story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["38k", "orders shipped"],
                ["96%", "customers repurchase"],
                ["4.8★", "average rating"],
                ["8.4k", "trees planted"],
                ["120k", "bottles recycled"],
                ["50L", "water saved per piece"],
              ].map(([value, label], i) => (
                <div
                  key={label}
                  className={`rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur ${
                    i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
                  }`}
                >
                  <p className="display text-2xl font-black text-forest-dark">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-forest-night/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- New arrivals ---- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-hand -rotate-2 text-2xl text-forest">
              just landed
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
              New arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
          >
            See everything
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <section className="border-y border-mist bg-mist/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <span className="font-hand -rotate-2 text-2xl text-forest">
              love notes
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
              Worn, loved, and re-worn
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Priya S.",
                role: "yoga teacher",
                text: "The leggings survived 20+ classes and still look new. Knowing they're made from ocean plastic makes them my favourite.",
              },
              {
                name: "Arjun M.",
                role: "architect",
                text: "Softest organic tees I've ever worn, and they arrived in beautiful paper packaging. Ethics aside, the feel is unreal.",
              },
              {
                name: "Neha K.",
                role: "photographer",
                text: "Finally a brand that cares. I love scanning the QR to trace where every piece came from. This is the future.",
              },
            ].map((t, i) => (
              <figure
                key={t.name}
                className={`rounded-3xl border border-mist bg-white p-8 shadow-sm ${
                  i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
                }`}
              >
                <div className="flex gap-0.5 text-amber-400" aria-label="5 stars">
                  {"★★★★★".split("").map((s, idx) => (
                    <span key={idx}>{s}</span>
                  ))}
                </div>
                <blockquote className="mt-5 leading-relaxed text-ink/75">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-6">
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="font-hand -rotate-2 text-lg text-forest">
                    {t.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Newsletter ---- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-forest-night px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-forest/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-forest-deep-2/60 blur-3xl" />
          <div className="relative">
            <span className="font-hand -rotate-2 text-2xl text-seafoam">
              join the grove
            </span>
            <h2 className="mt-2 text-4xl font-extrabold text-white">
              Get 10% off your first order
            </h2>
            <p className="mx-auto mt-4 max-w-md text-seafoam/70">
              Drops, giveaways and a small seeding of good news. No spam, just
              seeds.
            </p>
            <NewsletterForm dark />
          </div>
        </div>
      </section>
    </>
  );
}