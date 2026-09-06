"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-mist px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl shadow-mist-deep/50">
        <div className="text-center">
          <span className="relative mx-auto flex h-14 w-14 overflow-hidden rounded-full">
            <Image
              src="/greenweave-logo.jpeg"
              alt="Greenweave logo"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </span>
          <h1 className="display mt-5 text-2xl font-extrabold text-ink">
            Admin login
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Manage products, categories and orders
          </p>
        </div>

        <form onSubmit={submit} className="mt-8">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Enter admin password"
              className="w-full rounded-xl border border-mist-deep py-3 pl-11 pr-11 text-sm outline-none focus:border-forest"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              aria-label="Toggle password visibility"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-ink/50">
          Default password:{" "}
          <code className="rounded bg-mist px-1.5 py-0.5">greenweave2026</code>
        </p>
        <p className="mt-3 text-center">
          <Link href="/" className="text-xs text-forest hover:underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}