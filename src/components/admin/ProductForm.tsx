"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { Category, Product } from "@/lib/types";

interface ProductFormProps {
  categories: Category[];
  product?: Product | null;
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0]?.id ?? ""
  );
  const [price, setPrice] = useState<string>(product ? String(product.price) : "");
  const [mrp, setMrp] = useState<string>(product?.mrp ? String(product.mrp) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [stock, setStock] = useState<string>(product ? String(product.stock) : "10");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : ["/images/products/tee-mist.svg"]
  );
  const [sizes, setSizes] = useState(
    (product?.sizes ?? ["XS", "S", "M", "L", "XL"]).join(", ")
  );
  const [colors, setColors] = useState((product?.colors ?? []).join(", "));
  const [sustainability, setSustainability] = useState(
    (product?.sustainability ?? []).join(", ")
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Read failed"));
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setImages((prev) => [...prev.filter((img) => img !== data.url), data.url]);
      } else {
        setError(data.error ?? "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function splitTags(value: string): string[] {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function addImageUrl() {
    const url = newImageUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setNewImageUrl("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    setSaving(true);
    setError(null);
    const payload = {
      name: name.trim(),
      categoryId,
      price: Number(price),
      mrp: mrp.trim() ? Number(mrp) : undefined,
      description: description.trim(),
      badge: badge.trim() || undefined,
      stock: Number(stock) || 0,
      featured,
      images,
      sizes: splitTags(sizes),
      colors: splitTags(colors),
      sustainability: splitTags(sustainability),
      rating: product?.rating ?? 0,
      reviews: product?.reviews ?? 0,
    };

    try {
      const res = isEdit
        ? await fetch(`/api/products/${product!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-mist-deep px-4 py-3 text-sm outline-none focus:border-forest";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-ink/60";

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-forest"
      >
        <ArrowLeft className="h-4 w-4" />         Back to products
      </Link>
      <h1 className="display mt-2 text-3xl font-extrabold text-ink">
        {isEdit ? "Edit product" : "Add new product"}
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        {isEdit ? "Update the details below and save." : "Fill in the details to publish a new product."}
      </p>

      <form onSubmit={save} className="mt-8 space-y-6">
        <section className="rounded-2xl border border-mist bg-white p-6">
          <h2 className="font-bold text-ink">Basic details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Organic Cotton Classic Tee"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputClass}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Badge</label>
              <input
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Bestseller, New, Sale…"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="799"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>MRP (₹) — optional</label>
              <input
                type="number"
                min={0}
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="999"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-sm font-medium text-ink/80">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded accent-forest"
                />
                Featured on home page
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell shoppers why this piece is special…"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-mist bg-white p-6">
          <h2 className="font-bold text-ink">Product photos</h2>
          <p className="mt-1 text-sm text-ink/60">
            Upload photos or paste image URLs. The first image is the main one.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((image, i) => (
              <div
                key={`${image}-${i}`}
                className="relative overflow-hidden rounded-xl bg-mist"
              >
                <Image
                  src={image}
                  alt={`Product photo ${i + 1}`}
                  width={200}
                  height={233}
                  className="aspect-[6/7] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-ink/70 to-transparent p-2">
                  {i === 0 && (
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 hover:bg-white"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <label
              className={`flex aspect-[6/7] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-deep text-ink/50 transition-colors hover:border-forest hover:text-forest ${
                uploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Upload className="h-6 w-6" />
                  <span className="px-3 text-center text-xs font-medium">
                    Upload photo
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImageUrl();
                }
              }}
              placeholder="Paste image URL…"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-mist px-5 py-3 text-sm font-semibold text-ink hover:bg-mist-deep"
            >
              <Plus className="h-4 w-4" /> Add URL
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-mist bg-white p-6">
          <h2 className="font-bold text-ink">Options &amp; sustainability</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Sizes (comma separated)</label>
              <input
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="XS, S, M, L, XL"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Colors (comma separated)</label>
              <input
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="Mist, Forest, White"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>
                Sustainability tags (comma separated)
              </label>
              <input
                value={sustainability}
                onChange={(e) => setSustainability(e.target.value)}
                placeholder="GOTS Cotton, Low Water, Fair Trade"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {isEdit ? "Save changes" : "Create product"}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="inline-flex items-center gap-2 rounded-full border border-mist-deep px-6 py-3.5 text-sm font-medium text-ink/70 hover:bg-mist"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          {isEdit && (
            <span className="hidden items-center gap-1.5 text-sm text-ink/40 sm:inline-flex">
              <ImagePlus className="h-4 w-4" /> Images will be saved locally
            </span>
          )}
        </div>
      </form>
    </div>
  );
}