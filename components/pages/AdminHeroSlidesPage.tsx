"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import AdminShell from "./AdminShell";
import SmartImage from "@/components/ui/SmartImage";
import {
  createHeroSlide,
  deleteHeroSlide,
  fetchHeroSlides,
  updateHeroSlide,
  type ApiHeroSlide,
  type HeroSlideInput,
} from "@/lib/admin-api";

interface HeroSlideFormState {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  order: string;
  isActive: boolean;
}

const emptyForm: HeroSlideFormState = {
  eyebrow: "",
  title: "",
  subtitle: "",
  cta: "",
  link: "",
  image: "",
  order: "0",
  isActive: true,
};

const slideToForm = (s: ApiHeroSlide): HeroSlideFormState => ({
  eyebrow: s.eyebrow ?? "",
  title: s.title,
  subtitle: s.subtitle ?? "",
  cta: s.cta ?? "",
  link: s.link ?? "",
  image: s.image,
  order: String(s.order ?? 0),
  isActive: s.isActive,
});

const formToInput = (form: HeroSlideFormState): HeroSlideInput => ({
  eyebrow: form.eyebrow.trim(),
  title: form.title.trim(),
  subtitle: form.subtitle.trim(),
  cta: form.cta.trim(),
  link: form.link.trim(),
  image: form.image.trim(),
  order: Number(form.order) || 0,
  isActive: form.isActive,
});

const inputCls =
  "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-neutral-500";

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<ApiHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiHeroSlide | null>(null);
  const [form, setForm] = useState<HeroSlideFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setSlides(await fetchHeroSlides());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const slides = await fetchHeroSlides();
        if (cancelled) return;
        setSlides(slides);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load slides");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const startEdit = (s: ApiHeroSlide) => {
    setEditing(s);
    setForm(slideToForm(s));
    setSaveError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setSaveError(null);
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
        await updateHeroSlide(editing._id, input);
        flash("Slide updated");
      } else {
        await createHeroSlide(input);
        flash("Slide created");
      }
      closeForm();
      await load();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save slide");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: ApiHeroSlide) => {
    if (!window.confirm(`Delete slide "${s.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteHeroSlide(s._id);
      flash("Slide deleted");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete slide");
    }
  };

  return (
    <AdminShell crumbLabel="Hero Slides">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
            Hero Slides
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage the rotating banners shown on the storefront home page.
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
            Add Slide
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
              {editing ? "Edit Slide" : "Add New Slide"}
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
              <span className={labelCls}>Eyebrow</span>
              <input
                value={form.eyebrow}
                onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                placeholder="e.g. New Collection"
                className={inputCls}
              />
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
              <span className={labelCls}>Title *</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Premium Oversized Fit"
                className={inputCls}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className={labelCls}>Subtitle</span>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Short supporting text for the banner"
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className={labelCls}>Button Label (CTA)</span>
              <input
                value={form.cta}
                onChange={(e) => setForm({ ...form, cta: e.target.value })}
                placeholder="e.g. Shop Now"
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className={labelCls}>Link</span>
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="/shop or /category/xxx"
                className={inputCls}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className={labelCls}>Image URL *</span>
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
                    width={160}
                    height={80}
                    className="h-32 w-full max-w-md rounded-lg object-cover"
                  />
                </span>
              )}
            </label>

            <label className="flex items-center gap-2.5 rounded-lg border border-neutral-200 px-4 py-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 accent-neutral-900"
              />
              <span className="text-sm font-medium text-neutral-700">
                Active (shown in carousel)
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
              {editing ? "Save Changes" : "Add Slide"}
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading && (
          <div className="col-span-full flex items-center justify-center gap-2 py-16 text-neutral-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm">Loading slides…</span>
          </div>
        )}
        {!loading && slides.length === 0 && (
          <div className="col-span-full flex items-center justify-center gap-2 py-16 text-neutral-400">
            <SlidersHorizontal size={22} />
            <span className="text-sm">
              {error ? "Could not load slides." : "No slides yet. Add one to get started."}
            </span>
          </div>
        )}
        {!loading &&
          slides.map((s) => (
            <div
              key={s._id}
              className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm"
            >
              <SmartImage
                src={s.image}
                alt=""
                width={640}
                height={320}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-neutral-900">{s.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      s.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {s.eyebrow && (
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-neutral-400">
                    {s.eyebrow}
                  </p>
                )}
                {s.subtitle && (
                  <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                    {s.subtitle}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                    Order {s.order}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      aria-label={`Edit ${s.title}`}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      aria-label={`Delete ${s.title}`}
                      className="rounded-lg border border-neutral-200 p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </AdminShell>
  );
}
