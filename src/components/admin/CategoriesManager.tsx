"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { Category } from "@/lib/types";
import CatalogPushButton from "@/components/admin/CatalogPushButton";

export default function CategoriesManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to add category");
      return;
    }
    setName("");
    setDescription("");
    router.refresh();
  }

  function startEdit(category: Category) {
    setEditing(category.id);
    setEditName(category.name);
    setEditDescription(category.description);
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDescription }),
    });
    if (res.ok) {
      setEditing(null);
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this category?")) return;
    setDeleting(id);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Cannot delete: category still has products.");
    }
    setDeleting(null);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-mist-deep px-4 py-2.5 text-sm outline-none focus:border-forest";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-extrabold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-ink/60">
            Organise your products into shoppable collections.
          </p>
        </div>
        <CatalogPushButton />
      </div>

      <form
        onSubmit={add}
        className="mt-6 rounded-2xl border border-mist bg-white p-6"
      >
        <h2 className="font-bold text-ink">Add a category</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.5fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Category name"
            className={inputClass}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description (optional)"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </button>
        </div>
        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}
      </form>

      <div className="mt-6 space-y-3">
        {categories.length === 0 && (
          <p className="rounded-2xl border border-dashed border-mist-deep py-12 text-center text-sm text-ink/50">
            No categories yet. Add your first one above.
          </p>
        )}
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-mist bg-white p-5"
          >
            {editing === category.id ? (
              <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr_auto_auto]">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputClass}
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={inputClass}
                />
                <button
                  onClick={() => saveEdit(category.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-mist-deep px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-mist"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink">{category.name}</p>
                  {category.description && (
                    <p className="mt-0.5 text-sm text-ink/60">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-ink/40">/{category.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink/70 hover:text-forest"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(category.id)}
                    disabled={deleting === category.id}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50"
                    aria-label={`Delete ${category.name}`}
                  >
                    {deleting === category.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}