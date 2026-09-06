"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Loader2, Lock, Mail, UserRound } from "lucide-react";
import { useUser } from "@/components/auth/UserProvider";

function AccountFormInner({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next = searchParams.get("next") || "/account/orders";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/user/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as {
        user: { id: string; name: string; email: string; createdAt: string };
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setUser(data.user);
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-md rounded-3xl border border-mist bg-white p-8 shadow-sm"
    >
      <h2 className="display text-2xl font-extrabold text-ink">
        {isLogin ? "Welcome back" : "Create your account"}
      </h2>
      <p className="mt-1.5 text-sm text-ink/60">
        {isLogin
          ? "Sign in to track your orders and browse faster."
          : "Save your details and track every order in one place."}
      </p>

      <div className="mt-6 space-y-4">
        {!isLogin && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
              Name
            </label>
            <div className="relative mt-1.5">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-mist-deep bg-mist/40 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          </div>
        )}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Email
          </label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-mist-deep bg-mist/40 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-mist-deep bg-mist/40 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
              placeholder="At least 6 characters"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest/20 transition-all hover:-translate-y-0.5 hover:bg-forest-dark disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isLogin ? "Signing in…" : "Creating account…"}
          </>
        ) : isLogin ? (
          "Sign in"
        ) : (
          "Create account"
        )}
      </button>

      <p className="mt-5 text-center text-sm text-ink/60">
        {isLogin ? "New to Greenweave?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? `/register?next=${encodeURIComponent(next)}` : `/login?next=${encodeURIComponent(next)}`}
          className="font-semibold text-forest hover:underline"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}

export default function AccountForm({ mode }: { mode: "login" | "register" }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-md items-center justify-center rounded-3xl border border-mist bg-white p-14">
          <Loader2 className="h-6 w-6 animate-spin text-forest" />
        </div>
      }
    >
      <AccountFormInner mode={mode} />
    </Suspense>
  );
}