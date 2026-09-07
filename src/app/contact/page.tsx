import Link from "next/link";
import { Clock, Mail, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = await getContent();
  return { title: content["contact.title"] };
}

export default async function ContactPage() {
  const content = await getContent();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-seafoam/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-forest/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-hand -rotate-2 text-2xl text-forest">
            {content["contact.eyebrow"]}
          </span>
          <h1 className="display mt-1 text-4xl font-extrabold text-ink sm:text-5xl">
            {content["contact.title"]}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink/60">
            {content["contact.text"]}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ContactForm />

          <div className="space-y-4">
            <Link
              href={`mailto:${content["contact.email"]}`}
              className="block"
            >
              <div className="flex items-center gap-4 rounded-2xl border border-mist bg-white p-5 shadow-sm transition-colors hover:border-forest">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-seafoam text-forest">
                  <Mail className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold text-ink">Email</p>
                  <p className="text-sm text-ink/60">{content["contact.email"]}</p>
                </div>
              </div>
            </Link>
            <Link href={`tel:${content["contact.phone"].replace(/[^+\d]/g, "")}`} className="block">
              <div className="flex items-center gap-4 rounded-2xl border border-mist bg-white p-5 shadow-sm transition-colors hover:border-forest">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-seafoam text-forest">
                  <Phone className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold text-ink">Phone</p>
                  <p className="text-sm text-ink/60">{content["contact.phone"]}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-4 rounded-2xl border border-mist bg-white p-5 shadow-sm">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-seafoam text-forest">
                <Clock className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-ink">Support hours</p>
                <p className="text-sm text-ink/60">{content["contact.hours"]}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-seafoam p-5">
              <p className="font-semibold text-forest">Wholesale &amp; press</p>
              <p className="mt-1 text-sm text-ink/70">
                Looking to stock Greenweave or feature our story?{" "}
                <Link href={`mailto:${content["contact.email"]}`} className="underline">
                  {content["contact.email"]}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}