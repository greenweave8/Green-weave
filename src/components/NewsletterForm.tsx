"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  }

  if (done) {
    return (
      <p
        className={`mx-auto mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${
          dark ? "bg-white/10 text-white" : "bg-seafoam text-forest"
        }`}
      >
        <CheckCircle2 className="h-5 w-5" /> Welcome to the grove!
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row ${
        dark ? "" : ""
      }`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={`flex-1 rounded-full px-5 py-3.5 text-sm outline-none ring-0 ${
          dark
            ? "bg-white/10 text-white placeholder:text-white/50 ring-white/20 focus:ring-2"
            : "bg-white text-ink placeholder:text-ink/40 ring-mist focus:ring-2 focus:ring-forest/30"
        }`}
      />
      <button
        type="submit"
        className="rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
      >
        Sign me up
      </button>
    </form>
  );
}