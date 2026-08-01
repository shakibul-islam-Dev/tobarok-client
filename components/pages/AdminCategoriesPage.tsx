"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  FolderTree,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import AdminShell from "./AdminShell";
import SmartImage from "@/components/ui/SmartImage";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
  type ApiCategory,
  type CategoryInput,
} from "@/lib/admin-api";

const CATEGORY_TYPES = ["collection", "signature", "budget", "accessory"];

interface CategoryFormState {
  title: string;
  slug: string;
  description: string;
  image: string;
  type: string;
  parent: string;
  order: string;
  isActive: boolean;
}

const emptyForm: CategoryFormState = {
  title: "",
  slug: "",
  description: "",
  image: "",
  type: "collection",
  parent: "",
  order: "0",
  isActive: true,
};

const categoryToForm = (c: ApiCategory): CategoryFormState => ({
  title: c.title,
  slug: c.slug,
  description: c.description ?? "",
  image: c.image ?? "",
  type: c.type,
  parent: c.parent ?? "",
  order: String(c.order ?? 0),
  isActive: c.isActive,
});

const formToInput = (form: CategoryFormState): CategoryInput => ({
  title: form.title.trim(),
  slug: form.slug.trim() || undefined,
  description: form.description.trim() || undefined,
  image: form.image.trim() || undefined,
  type: form.type,
  parent: form.parent || undefined,
  order: Number(form.order) || 0,
  isActive: form.isActive,
});

const inputCls =
  "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-neutral-500";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiCategory | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await fetchCategories({ active: "false" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cats = await fetchCategories({ active: "false" });
        if (cancelled) return;
        setCategories(cats);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load categories"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const parentOptions = useMemo(
    () => categories.filter((c) => !editing || c._id !== editing._id),
    [categories, editing]
  );

  const flash = (msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(null), 3000);
  };

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSaveError(null);
    setShowForm(true);
  };

  const startEdit = (c: ApiCategory) => {
    setEditing(c);
    setForm(categoryToForm(c));
    setSaveError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setSaveError(null);
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: f.slug === "" || f.slug === slugify(f.title) ? slugify(title) : f.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setSaveError("Title is required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const input = formToInput(form);
      if (editing) {
        await updateCategory(editing._id, input);
        flash("Category updated");
      } else {
        await createCategory(input);
        flash("Category created");
      }
      closeForm();
      await load();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: ApiCategory) => {
    if (!window.confirm(`Delete category "${c.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteCategory(c._id);
      flash("Category deleted");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete category");
    }
  };

  return (
    <AdminShell crumbLabel="Categories">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Organize products into collections, signature series, budget and
            accessory groups.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>
      </div>

      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check size={16} />
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div className="whitespace-pre-line">{error}</div>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              {editing ? "Edit Category" : "Add New Category"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
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
            <label className="block">
              <span className={labelCls}>Title *</span>
              <input
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Signature Series"
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
              <span className={labelCls}>Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputCls}
              >
                {CATEGORY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelCls}>Parent Category</span>
              <select
                value={form.parent}
                onChange={(e) => setForm({ ...form, parent: e.target.value })}
                className={inputCls}
              >
                <option value="">— None —</option>
                {parentOptions.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelCls}>Order</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                placeholder="0"
                className={inputCls}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className={labelCls}>Image URL</span>
              <input
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
              <span className={labelCls}>Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="What does this category cover?"
                className={inputCls}
              />
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
              {editing ? "Save Changes" : "Add Category"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="bg-neutral-100/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                <th scope="col" className="px-6 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Type
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Parent
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Order
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-400">
                    <Loader2 size={22} className="mx-auto mb-2 animate-spin text-neutral-300" />
                    Loading categories…
                  </td>
                </tr>
              )}
              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-400">
                    <FolderTree size={22} className="mx-auto mb-2 text-neutral-300" />
                    {error
                      ? "Could not load categories."
                      : "No categories yet. Add one to get started."}
                  </td>
                </tr>
              )}
              {!loading &&
                categories.map((c) => {
                  const parent = categories.find((p) => p._id === c.parent);
                  return (
                    <tr key={c._id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {c.image ? (
                            <SmartImage
                              src={c.image}
                              alt=""
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                              <FolderTree size={18} />
                            </span>
                          )}
                          <div>
                            <p className="font-medium text-neutral-900">
                              {c.title}
                            </p>
                            <p className="text-xs text-neutral-400">
                              /{c.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                          {c.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {parent ? parent.title : "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {c.order}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            c.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(c)}
                            aria-label={`Edit ${c.title}`}
                            className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c)}
                            aria-label={`Delete ${c.title}`}
                            className="rounded-lg border border-neutral-200 p-2 text-red-500 transition-colors hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
