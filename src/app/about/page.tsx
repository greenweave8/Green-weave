import Image from "next/image";
import Link from "next/link";
import { Droplets, Handshake, Leaf, Recycle, Sprout, TreePine } from "lucide-react";

export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest-night">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-forest/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-seafoam/10 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 h-24 w-24 rotate-12 rounded-3xl border border-white/10" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="font-hand -rotate-2 text-2xl text-seafoam">
              a small studio
            </span>
            <h1 className="display mt-2 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Weaving a kinder wardrobe.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Greenweave started in 2021 with one stubborn belief: your clothes
              shouldn&apos;t cost the Earth. Today we make small-batch essentials
              in Auroville, Tamil Nadu, from fibres grown and recycled with
              care.
            </p>
            <div className="mt-6">
              <span className="inline-flex rotate-1 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-hand text-xl text-seafoam">
                🌱 slow fashion, done properly
              </span>
            </div>
          </div>
          <Image
            src="/images/products/tote-seafoam.svg"
            alt="Greenweave studio"
            width={560}
            height={420}
            className="w-full max-w-lg -rotate-2 rounded-3xl shadow-2xl shadow-black/40"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-hand -rotate-2 text-2xl text-forest">
            how we do it
          </span>
          <h2 className="display mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
            The Greenweave promise
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Sprout,
              title: "Organic, always",
              text: "GOTS-certified organic cotton, European flax hemp and bamboo viscose. No pesticides, no GMOs, no shortcuts.",
            },
            {
              icon: Droplets,
              title: "Water and dyes, re-thought",
              text: "Low-water dyeing and natural indigo save up to 40% water per garment, with zero toxic runoff.",
            },
            {
              icon: Recycle,
              title: "Plastic that comes full circle",
              text: "Every recycled-polyester piece turns discarded bottles and ocean plastic into fabric you'll love wearing.",
            },
            {
              icon: Leaf,
              title: "Small batches, real traceability",
              text: "We cut in small batches and tag every garment so you can trace it back to the mill and the hands that made it.",
            },
            {
              icon: TreePine,
              title: "One tree per order",
              text: "Every single order funds a native tree planted with grassroots groups across India.",
            },
            {
              icon: Handshake,
              title: "Fair from first stitch",
              text: "Fair-trade wages, safe studios, and long-term partnerships with our makers in Tamil Nadu.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="group rounded-3xl border border-mist bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-seafoam hover:shadow-xl hover:shadow-forest/5"
              style={{ transform: `rotate(${i % 2 === 0 ? -0.4 : 0.4}deg)` }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-seafoam text-forest transition-transform duration-300 group-hover:-rotate-6">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="display mt-4 text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-seafoam/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="font-hand -rotate-2 text-2xl text-forest">
                the receipts, not just the vibes
              </span>
              <h2 className="display mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
                2025 impact, in plain numbers
              </h2>
              <p className="mt-4 leading-relaxed text-ink/70">
                We won&apos;t hide behind vague claims — here&apos;s exactly what
                our community achieved together last year.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 hover:bg-forest-dark"
              >
                Shop our collection
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["4.2L", "litres of water saved"],
                ["96k", "bottles turned to fibre"],
                ["8,400", "trees planted"],
                ["1,200", "fair-wage jobs supported"],
              ].map(([value, label], i) => (
                <div
                  key={label}
                  className="rounded-3xl bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                  style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
                >
                  <p className="display text-3xl font-extrabold text-forest">{value}</p>
                  <p className="mt-1 text-sm text-ink/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="font-hand -rotate-2 text-2xl text-forest">
          got the itch?
        </span>
        <h2 className="display mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
          Curious about a wardrobe that heals?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-ink/60">
          Explore pieces that feel as good as they do good.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 hover:bg-forest-dark"
        >
          Start shopping
        </Link>
      </section>
    </>
  );
}