import Link from "next/link";
import { Clock, Mail, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-seafoam/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-forest/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-hand -rotate-2 text-2xl text-forest">
            we&apos;re all ears
          </span>
          <h1 className="display mt-1 text-4xl font-extrabold text-ink sm:text-5xl">
            Say hello to Greenweave
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink/60">
            Questions about sizing, orders, returns or wholesale? Drop us a line —
            we reply within one working day.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ContactForm />

          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email", text: "greenweave8@gmail.com" },
              { icon: Phone, title: "Phone", text: "+91 89287 81563" },
              {
                icon: Clock,
                title: "Support hours",
                text: "Mon–Sat, 9am–6pm IST",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-2xl border border-mist bg-white p-5 shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-seafoam text-forest">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="text-sm text-ink/60">{text}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-seafoam p-5">
              <p className="font-semibold text-forest">Wholesale &amp; press</p>
              <p className="mt-1 text-sm text-ink/70">
                Looking to stock Greenweave or feature our story?{" "}
                <Link href="mailto:press@greenweave.in" className="underline">
                  press@greenweave.in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}