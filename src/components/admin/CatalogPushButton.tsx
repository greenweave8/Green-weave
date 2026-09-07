"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert, Upload } from "lucide-react";

interface SyncState {
  pending: boolean;
  canPush: boolean;
}

type Feedback =
  | { tone: "ok" | "warn" | "error"; text: string }
  | null;

/**
 * Shows whether the product catalogue (products + categories) is in sync with
 * GitHub and lets the admin push any not-yet-pushed changes manually. Renders
 * nothing when git push isn't available (e.g. on Render).
 */
export default function CatalogPushButton() {
  const [state, setState] = useState<SyncState | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const didFetch = useRef(false);

  async function refresh() {
    try {
      const res = await fetch("/api/catalog/sync");
      if (res.ok) {
        const data = (await res.json()) as SyncState;
        setState(data);
      }
    } catch {
      // ignore — status is informational
    }
  }

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    refresh();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function show(text: string, tone: NonNullable<Feedback>["tone"]) {
    setFeedback({ text, tone });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(null), 5000);
  }

  async function push() {
    setBusy(true);
    try {
      const res = await fetch("/api/catalog/sync", { method: "POST" });
      const data = (await res.json()) as {
        error?: string;
        pushed?: boolean;
        pending?: boolean;
      };
      if (!res.ok) {
        show(data.error ?? "Push failed.", "error");
        return;
      }
      if (data.pushed) {
        show("Pushed to GitHub", "ok");
      } else if (data.pending) {
        show("Push failed — changes are still pending.", "error");
      } else {
        show("Nothing to push — already up to date.", "ok");
      }
      await refresh();
    } catch {
      show("Network error. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  if (!state) return null;
  if (!state.canPush) return null;

  const statusText = state.pending
    ? "Catalog not pushed to GitHub yet"
    : "Catalog up to date — pushed to GitHub";
  const statusTone = state.pending ? "warn" : "ok";

  let icon: React.ReactNode;
  if (feedback) {
    icon =
      feedback.tone === "ok" ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      );
  } else {
    icon =
      statusTone === "warn" ? (
        <TriangleAlert className="h-4 w-4" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      );
  }

  const feedbackToneClass =
    feedback?.tone === "error"
      ? "text-red-600"
      : feedback?.tone === "warn" || statusTone === "warn"
        ? "text-amber-600"
        : "text-forest";

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex items-center gap-1.5 text-sm font-medium ${feedbackToneClass}`}
      >
        {icon}
        {feedback ? feedback.text : statusText}
      </span>
      <button
        onClick={push}
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-mist-deep bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-mist disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 text-forest" />
        )}
        Push to GitHub
      </button>
    </div>
  );
}