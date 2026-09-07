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
import { getContent } from "@/lib/content";
import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await getContent();
  return { title: content["brand.metaTitle"] };
}

export default async function HomePage() {
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getContent(),
  ]);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = [...products]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);
  const categoryCards = categories.slice(0, 4);

  const marqueeItems = content["home.marqueeItems"]
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const heroStats: [string, string][] = [
    ["home.heroStat1", "home.heroStat1Label"],
    ["home.heroStat2", "home.heroStat2Label"],
    ["home.heroStat3", "home.heroStat3Label"],
  ].map(([v, l]) => [content[v], content[l]]);

  const pillars = [
    { icon: Leaf, title: content["home.pillar1Title"], text: content["home.pillar1Text"] },
    { icon: Droplets, title: content["home.pillar2Title"], text: content["home.pillar2Text"] },
    { icon: Recycle, title: content["home.pillar3Title"], text: content["home.pillar3Text"] },
    { icon: ShieldCheck, title: content["home.pillar4Title"], text: content["home.pillar4Text"] },
  ];

  const impactStats: [string, string][] = [1, 2, 3, 4, 5, 6].map((i) => [
    content[`home.impactStat${i}`],
    content[`home.impactStat${i}Label`],
  ]);

  const testimonials = [1, 2, 3].map((i) => ({
    name: content[`home.testimonial${i}Name`],
    role: content[`home.testimonial${i}Role`],
    text: content[`home.testimonial${i}Text`],
  }));

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
              <Sparkles className="h-4 w-4" /> {content["home.heroBadge"]}
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {content["home.heroTitleLine1"]}
              <br />
              <span className="text-seafoam">{content["home.heroTitleAccent"]}</span>{" "}
              <span className="italic text-seafoam/70">{content["home.heroTitleAccent2"]}</span>
              <br />
              {content["home.heroTitleLine3"]}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-seafoam/70">
              {content["home.heroSubtitle"]}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-seafoam px-8 py-4 text-sm font-bold text-forest-night transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-seafoam/20"
              >
                {content["home.heroCtaPrimary"]}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-seafoam/30 px-8 py-4 text-sm font-semibold text-seafoam transition-colors hover:bg-seafoam/10"
              >
                {content["home.heroCtaSecondary"]}
              </Link>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-seafoam/15 pt-8">
              {heroStats.map(([value, label]) => (
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
            <div className="absolute -left-6 top-10 rotate-[-4deg] whitespace-pre-line rounded-2xl bg-white/95 px-5 py-3 font-hand text-lg text-forest-night shadow-lg">
              {content["home.heroSticker1"]}
            </div>
            <div className="absolute -right-4 bottom-12 rotate-[3deg] rounded-2xl bg-seafoam px-5 py-3 font-hand text-lg text-forest-night shadow-lg">
              {content["home.heroSticker2"]}
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
              {content["home.pillarsEyebrow"]}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
              {content["home.pillarsTitle"]}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, text }, i) => (
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
              {content["home.bestsellersEyebrow"]}
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
              {content["home.bestsellersTitle"]}
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
          >
            {content["home.bestsellersLink"]}
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
              {content["home.categoriesEyebrow"]}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              {content["home.categoriesTitle"]}
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
                      {content["home.categoriesCta"]} <ArrowRight className="h-4 w-4" />
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
                {content["home.impactEyebrow"]}
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-forest-night sm:text-4xl">
                {content["home.impactTitle"]}
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-forest-night/70">
                {content["home.impactText"]}
              </p>
              <Link
                href="/about"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-forest-night px-8 py-4 text-sm font-bold text-seafoam transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {content["home.impactCta"]}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {impactStats.map(([value, label], i) => (
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
              {content["home.arrivalsEyebrow"]}
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
              {content["home.arrivalsTitle"]}
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
          >
            {content["home.arrivalsLink"]}
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
              {content["home.testimonialsEyebrow"]}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
              {content["home.testimonialsTitle"]}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
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
              {content["home.newsletterEyebrow"]}
            </span>
            <h2 className="mt-2 text-4xl font-extrabold text-white">
              {content["home.newsletterTitle"]}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-seafoam/70">
              {content["home.newsletterText"]}
            </p>
            <NewsletterForm dark />
          </div>
        </div>
      </section>
    </>
  );
}