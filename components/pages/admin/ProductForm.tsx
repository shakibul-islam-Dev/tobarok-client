"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import {
  createProduct,
  updateProduct,
  type ApiCategory,
  type ApiProduct,
  type ApiProductColor,
  type ProductInput,
} from "@/lib/admin-api";

interface ProductFormProps {
  editing?: ApiProduct | null;
  categories: ApiCategory[];
  onSaved: () => void;
  onCancel: () => void;
}

interface ProductFormState {
  title: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string;
  price: string;
  originalPrice: string;
  costPrice: string;
  badge: string;
  category: string;
  collections: string;
  signatureSeries: string;
  tags: string;
  sizes: string;
  colors: string;
  stockQuantity: string;
  pointsReward: string;
  inStock: boolean;
  isActive: boolean;
  weight: string;
}

const emptyForm: ProductFormState = {
  title: "",
  slug: "",
  sku: "",
  description: "",
  shortDescription: "",
  image: "",
  images: "",
  price: "",
  originalPrice: "",
  costPrice: "",
  badge: "",
  category: "",
  collections: "",
  signatureSeries: "",
  tags: "",
  sizes: "",
  colors: "",
  stockQuantity: "0",
  pointsReward: "0",
  inStock: true,
  isActive: true,
  weight: "",
};

const toList = (value: string): string[] | undefined => {
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
};

const parseColors = (value: string): ApiProductColor[] | undefined => {
  const colors = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [name, hex] = s.split(/\s+/);
      return { name: name ?? s, hex: hex && hex.startsWith("#") ? hex : undefined };
    });
  return colors.length ? colors : undefined;
};

const toOptionalNumber = (value: string): number | undefined => {
  const n = Number(value);
  return value.trim() === "" || Number.isNaN(n) ? undefined : n;
};

const productToForm = (p: ApiProduct): ProductFormState => ({
  title: p.title,
  slug: p.slug,
  sku: p.sku ?? "",
  description: p.description ?? "",
  shortDescription: p.shortDescription ?? "",
  image: p.image,
  images: (p.images ?? []).join(", "),
  price: String(p.price),
  originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
  costPrice: p.costPrice != null ? String(p.costPrice) : "",
  badge: p.badge ?? "",
  category: p.category,
  collections: (p.collections ?? []).join(", "),
  signatureSeries: (p.signatureSeries ?? []).join(", "),
  tags: (p.tags ?? []).join(", "),
  sizes: (p.sizes ?? []).join(", "),
  colors: (p.colors ?? [])
    .map((c) => (c.hex ? `${c.name} ${c.hex}` : c.name))
    .join(", "),
  stockQuantity: String(p.stockQuantity ?? 0),
  pointsReward: String(p.pointsReward ?? 0),
  inStock: p.inStock,
  isActive: p.isActive,
  weight: p.weight != null ? String(p.weight) : "",
});

const formToInput = (form: ProductFormState): ProductInput => ({
  title: form.title.trim(),
  slug: form.slug.trim() || undefined,
  sku: form.sku.trim() || undefined,
  description: form.description.trim() || undefined,
  shortDescription: form.shortDescription.trim() || undefined,
  image: form.image.trim(),
  images: toList(form.images),
  price: Number(form.price) || 0,
  originalPrice: toOptionalNumber(form.originalPrice),
  costPrice: toOptionalNumber(form.costPrice),
  badge: form.badge.trim() || undefined,
  category: form.category.trim() || undefined,
  collections: toList(form.collections),
  signatureSeries: toList(form.signatureSeries),
  tags: toList(form.tags),
  sizes: toList(form.sizes),
  colors: parseColors(form.colors),
  stockQuantity: Number(form.stockQuantity) || 0,
  pointsReward: Number(form.pointsReward) || 0,
  inStock: form.inStock,
  isActive: form.isActive,
  weight: toOptionalNumber(form.weight),
});

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inputCls =
  "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900";
const labelCls =
  "text-xs font-semibold uppercase tracking-wider text-neutral-500";

export default function ProductForm({
  editing,
  categories,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormState>(() =>
    editing ? productToForm(editing) : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const categoryOptions = categories.map((c) => c.slug);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: f.slug === "" || f.slug === slugify(f.title) ? slugify(title) : f.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image.trim()) {
      setSaveError("Title and image URL are required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const input = formToInput(form);
      if (editing) {
        await updateProduct(editing._id, input);
      } else {
        await createProduct(input);
      }
      onSaved();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-neutral-900">
          {editing ? "Edit Product" : "Add New Product"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          className="p-1 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X size={18} />
        </button>
      </div>

      {saveError && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm whitespace-pre-line text-red-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {saveError}
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelCls}>Title *</span>
          <input
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Drop Shoulder T-Shirt (Ocean)"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Slug</span>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="auto-generated from title"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>SKU</span>
          <input
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            placeholder="e.g. TB-POLO-001"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Price (৳) *</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="0"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Original Price / Discount (৳)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.originalPrice}
            onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
            placeholder="optional strike-through price"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Stock Quantity</span>
          <input
            type="number"
            min="0"
            step="1"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
            placeholder="0"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Points for Buy</span>
          <input
            type="number"
            min="0"
            step="1"
            value={form.pointsReward}
            onChange={(e) => setForm({ ...form, pointsReward: e.target.value })}
            placeholder="0"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Cost Price (৳)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            placeholder="optional"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Weight (kg)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            placeholder="optional"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Category (slug)</span>
          <input
            list="admin-category-options"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. drop-shoulder, polo, solid…"
            className={inputCls}
          />
          <datalist id="admin-category-options">
            {categoryOptions.map((slug) => (
              <option key={slug} value={slug} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className={labelCls}>Badge</span>
          <input
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            placeholder="e.g. Most Wanted, Best Deal"
            className={inputCls}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>Main Image URL *</span>
          <input
            required
            type="url"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://images.unsplash.com/…"
            className={inputCls}
          />
          {form.image.trim() && (
            <span className="mt-2 block">
              <SmartImage
                src={form.image.trim()}
                alt="Preview"
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-cover"
              />
            </span>
          )}
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>
            Additional Images (comma separated URLs)
          </span>
          <input
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="url1, url2, url3"
            className={inputCls}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>Short Description</span>
          <textarea
            rows={2}
            value={form.shortDescription}
            onChange={(e) =>
              setForm({ ...form, shortDescription: e.target.value })
            }
            placeholder="One-line summary shown on product cards"
            className={inputCls}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>Full Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Detailed product description"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Sizes (comma separated)</span>
          <input
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            placeholder="S, M, L, XL, XXL"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Colors (Name #hex, comma separated)</span>
          <input
            value={form.colors}
            onChange={(e) => setForm({ ...form, colors: e.target.value })}
            placeholder="Black #000000, White #FFFFFF"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Collections (comma separated)</span>
          <input
            value={form.collections}
            onChange={(e) => setForm({ ...form, collections: e.target.value })}
            placeholder="polo, best-deal"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Signature Series (comma separated)</span>
          <input
            value={form.signatureSeries}
            onChange={(e) =>
              setForm({ ...form, signatureSeries: e.target.value })
            }
            placeholder="deshi-talk"
            className={inputCls}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelCls}>Tags (comma separated)</span>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="oversized, cotton, summer"
            className={inputCls}
          />
        </label>

        <label className="flex items-center gap-2.5 rounded-lg border border-neutral-200 px-4 py-3">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            className="h-4 w-4 accent-neutral-900"
          />
          <span className="text-sm font-medium text-neutral-700">In stock</span>
        </label>

        <label className="flex items-center gap-2.5 rounded-lg border border-neutral-200 px-4 py-3">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 accent-neutral-900"
          />
          <span className="text-sm font-medium text-neutral-700">
            Active (visible in store)
          </span>
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {editing ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
