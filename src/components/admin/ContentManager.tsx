"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, RotateCcw, Save } from "lucide-react";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content-data";

function pretty(key: string): string {
  const name = key.split(".").slice(1).join(".");
  return name
    .split(/(?=[A-Z0-9])/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function textareaAttrs(value: string): { rows: number } {
  return { rows: Math.max(1, Math.min(6, Math.ceil(value.length / 60))) };
}

export default function ContentManager({
  content,
}: {
  content: SiteContent;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const key of Object.keys(DEFAULT_CONTENT)) {
      const group = key.split(".")[0];
      map.set(group, [...(map.get(group) ?? []), key]);
    }
    return [...map.entries()];
  }, []);

  const [values, setValues] = useState<SiteContent>({
    ...DEFAULT_CONTENT,
    ...content,
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    setStatus(null);
    const patch: SiteContent = {};
    for (const key of Object.keys(DEFAULT_CONTENT)) {
      if (content[key] !== values[key]) patch[key] = values[key];
    }
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { error?: string; pushed?: boolean };
      if (!res.ok) {
        setError(data.error ?? "Could not save changes.");
        return;
      }
      if (Object.keys(patch).length === 0) {
        setStatus("No changes to save.");
      } else {
        setStatus(
          data.pushed
            ? "Saved. Changes were committed & pushed to GitHub."
            : "Saved. Auto-push is only available from a local dev git checkout — changes are saved here regardless."
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-extrabold text-ink">
            Site content
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Edit every piece of text across the website. Saving auto-commits
            and pushes to GitHub so your live site stays in sync.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setValues({ ...DEFAULT_CONTENT, ...content })
            }
            className="inline-flex items-center gap-2 rounded-xl border border-mist-deep bg-white px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-mist"
          >
            <RotateCcw className="h-4 w-4" /> Reset draft
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save &amp; push
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-seafoam px-4 py-3 text-sm text-forest">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {status}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {groups.map(([group, keys]) => (
        <section
          key={group}
          className="mt-6 rounded-2xl border border-mist bg-white p-6"
        >
          <h2 className="font-hand -rotate-1 text-2xl capitalize text-forest">
            {group}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {keys.map((key) => (
              <div key={key}>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                  {pretty(key)}
                  <span className="ml-2 font-normal normal-case text-ink/30">
                    {key}
                  </span>
                </label>
                <textarea
                  value={values[key]}
                  onChange={(e) => setValue(key, e.target.value)}
                  rows={textareaAttrs(values[key]).rows}
                  className="mt-1.5 w-full resize-y rounded-xl border border-mist-deep bg-mist/30 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-seafoam"
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-6 flex items-center justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save &amp; push
        </button>
      </div>
    </div>
  );
}