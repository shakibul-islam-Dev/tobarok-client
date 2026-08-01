"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import AdminShell from "./AdminShell";
import {
  createOutlet,
  deleteOutlet,
  fetchOutlets,
  updateOutlet,
  type ApiOutlet,
  type OutletInput,
} from "@/lib/admin-api";

interface OutletFormState {
  name: string;
  area: string;
  hours: string;
  phone: string;
  lat: string;
  lng: string;
  isActive: boolean;
}

const emptyForm: OutletFormState = {
  name: "",
  area: "",
  hours: "",
  phone: "",
  lat: "",
  lng: "",
  isActive: true,
};

const outletToForm = (o: ApiOutlet): OutletFormState => ({
  name: o.name,
  area: o.area,
  hours: o.hours ?? "",
  phone: o.phone ?? "",
  lat: o.coordinates?.lat != null ? String(o.coordinates.lat) : "",
  lng: o.coordinates?.lng != null ? String(o.coordinates.lng) : "",
  isActive: o.isActive,
});

const toOptionalNumber = (value: string): number | undefined => {
  const n = Number(value);
  return value.trim() === "" || Number.isNaN(n) ? undefined : n;
};

const formToInput = (form: OutletFormState): OutletInput => {
  const lat = toOptionalNumber(form.lat);
  const lng = toOptionalNumber(form.lng);
  return {
    name: form.name.trim(),
    area: form.area.trim(),
    hours: form.hours.trim(),
    phone: form.phone.trim() || undefined,
    coordinates:
      lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)
        ? { lat, lng }
        : undefined,
    isActive: form.isActive,
  };
};

const inputCls =
  "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-neutral-500";

export default function AdminOutletsPage() {
  const [outlets, setOutlets] = useState<ApiOutlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiOutlet | null>(null);
  const [form, setForm] = useState<OutletFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setOutlets(await fetchOutlets());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load outlets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const outlets = await fetchOutlets();
        if (cancelled) return;
        setOutlets(outlets);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load outlets");
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

  const startEdit = (o: ApiOutlet) => {
    setEditing(o);
    setForm(outletToForm(o));
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
    if (!form.name.trim() || !form.area.trim()) {
      setSaveError("Name and area are required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const input = formToInput(form);
      if (editing) {
        await updateOutlet(editing._id, input);
        flash("Outlet updated");
      } else {
        await createOutlet(input);
        flash("Outlet created");
      }
      closeForm();
      await load();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save outlet");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (o: ApiOutlet) => {
    if (!window.confirm(`Delete outlet "${o.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteOutlet(o._id);
      flash("Outlet deleted");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete outlet");
    }
  };

  return (
    <AdminShell crumbLabel="Outlets">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
            Outlets
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage physical store locations shown on the store locator page.
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
            Add Outlet
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
              {editing ? "Edit Outlet" : "Add New Outlet"}
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
              <span className={labelCls}>Name *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dhanmondi Flagship Store"
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className={labelCls}>Area *</span>
              <input
                required
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="e.g. Dhanmondi, Dhaka"
                className={inputCls}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className={labelCls}>Hours</span>
              <input
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                placeholder="e.g. Sat–Thu, 10:00 AM – 9:00 PM"
                className={inputCls}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className={labelCls}>Phone</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. +880 17XX-XXXXXX"
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className={labelCls}>Latitude</span>
              <input
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                placeholder="e.g. 23.7461"
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className={labelCls}>Longitude</span>
              <input
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
                placeholder="e.g. 90.3742"
                className={inputCls}
              />
            </label>

            <label className="flex items-center gap-2.5 rounded-lg border border-neutral-200 px-4 py-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 accent-neutral-900"
              />
              <span className="text-sm font-medium text-neutral-700">
                Active (visible in store locator)
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
              {editing ? "Save Changes" : "Add Outlet"}
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
                  Outlet
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Hours
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Coordinates
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
                    Loading outlets…
                  </td>
                </tr>
              )}
              {!loading && outlets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-400">
                    <MapPin size={22} className="mx-auto mb-2 text-neutral-300" />
                    {error
                      ? "Could not load outlets."
                      : "No outlets yet. Add one to get started."}
                  </td>
                </tr>
              )}
              {!loading &&
                outlets.map((o) => (
                  <tr key={o._id} className="hover:bg-neutral-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{o.name}</p>
                      <p className="text-xs text-neutral-400">{o.area}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {o.hours || "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {o.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {o.coordinates
                        ? `${o.coordinates.lat.toFixed(4)}, ${o.coordinates.lng.toFixed(4)}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          o.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {o.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(o)}
                          aria-label={`Edit ${o.name}`}
                          className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(o)}
                          aria-label={`Delete ${o.name}`}
                          className="rounded-lg border border-neutral-200 p-2 text-red-500 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
