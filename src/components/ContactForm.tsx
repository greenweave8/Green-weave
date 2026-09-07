"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-mist bg-white p-14 text-center">
        <CheckCircle2 className="h-14 w-14 text-forest" />
        <h2 className="mt-4 text-xl font-bold text-ink">Message sent!</h2>
        <p className="mt-2 max-w-sm text-ink/60">
          Thanks for reaching out. We&apos;ll get back to you at {email} within
          one working day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-mist bg-white p-8"
    >
      <h2 className="display text-2xl font-extrabold text-ink">Send a message</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-full border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-full border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
            placeholder="you@email.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Subject
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1.5 w-full rounded-full border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
            placeholder="How can we help?"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Message
          </label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5 w-full rounded-3xl border border-mist-deep bg-mist/40 px-4 py-3 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
            placeholder="Write your message here…"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 transition-all hover:-translate-y-0.5 hover:bg-forest-dark disabled:opacity-60"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send message
          </>
        )}
      </button>
    </form>
  );
}