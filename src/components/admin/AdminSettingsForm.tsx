"use client";

import { useState } from "react";
import { KeyRound, Loader2, Save } from "lucide-react";

export default function AdminSettingsForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!current || !next || !confirm) {
      setError("Fill in all three fields.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    if (next === current) {
      setError("New password must be different from the current one.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: current, newPassword: next }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not update the password.");
        return;
      }
      setCurrent("");
      setNext("");
      setConfirm("");
      setStatus("Password updated. Use the new password next time you log in.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div>
        <h1 className="display text-3xl font-extrabold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink/60">
          Change the admin password. You must enter the current password to
          continue.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-6 max-w-md rounded-2xl border border-mist bg-white p-6"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
          Current password
        </label>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-xl border border-mist-deep bg-mist/30 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
        />

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-ink/60">
          New password
        </label>
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-xl border border-mist-deep bg-mist/30 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
        />

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-ink/60">
          Confirm new password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-xl border border-mist-deep bg-mist/30 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save new password
        </button>

        {status && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-seafoam px-4 py-3 text-sm text-forest">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
            {status}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}