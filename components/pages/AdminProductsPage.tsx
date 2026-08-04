"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  Check,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import AdminShell from "./AdminShell";
import ProductForm from "./admin/ProductForm";
import SmartImage from "@/components/ui/SmartImage";
import { demoCategories, demoProducts } from "@/lib/client-demo";
import {
  deleteProduct,
  fetchCategories,
  fetchProducts,
  type ApiCategory,
  type ApiProduct,
} from "@/lib/admin-api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>(demoProducts);
  const [categories, setCategories] =
    useState<ApiCategory[]>(demoCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts({ limit: "200", active: "false" }),
        fetchCategories({ active: "false" }),
      ]);
      setProducts(prods.products);
      setCategories(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prods, cats] = await Promise.all([
          fetchProducts({ limit: "200", active: "false" }),
          fetchCategories({ active: "false" }),
        ]);
        if (cancelled) return;
        setProducts(prods.products);
        setCategories(cats);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load products"
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

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          !search ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase()) ||
          (p.category ?? "").toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const flash = (msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(null), 3000);
  };

  const startCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const startEdit = (p: ApiProduct) => {
    setEditing(p);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSaved = async () => {
    flash(editing ? "Product updated" : "Product created");
    closeForm();
    await load();
  };

  const handleDelete = async (p: ApiProduct) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setProducts((cur) => cur.filter((x) => x._id !== p._id));
    flash("Product deleted");
    try {
      await deleteProduct(p._id);
    } catch {
      // Backend unreachable — the product stays removed locally.
    }
  };

  return (
    <AdminShell crumbLabel="Products">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Add new products straight to the database, update details, and
            manage stock.
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
            Add Product
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
        <div className="mt-6">
          <ProductForm
            key={editing?._id ?? "new"}
            editing={editing}
            categories={categories}
            onSaved={handleSaved}
            onCancel={closeForm}
          />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by title, slug, or category…"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 sm:max-w-xs"
        />
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          {filtered.length} of {products.length} products
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-neutral-100/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                <th scope="col" className="px-6 py-3.5">
                  Product
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Price
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Points
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Stock
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
                  <td colSpan={7} className="px-6 py-10 text-center text-neutral-400">
                    <Loader2 size={22} className="mx-auto mb-2 animate-spin text-neutral-300" />
                    Loading products…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-neutral-400">
                    <Boxes size={22} className="mx-auto mb-2 text-neutral-300" />
                    {error
                      ? "Could not load products."
                      : "No products found. Add one to get started."}
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <SmartImage
                          src={p.image}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-neutral-900">
                            {p.title}
                          </p>
                          <p className="text-xs text-neutral-400">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {p.category || "—"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      ৳{p.price.toLocaleString()}
                      {p.originalPrice != null && (
                        <span className="ml-1.5 text-xs font-normal text-neutral-400 line-through">
                          ৳{p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500">
                      {p.pointsReward ? `${p.pointsReward} pts` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          p.stockQuantity === 0
                            ? "text-red-600"
                            : "text-neutral-700"
                        }`}
                      >
                        {p.stockQuantity === 0
                          ? "Out of stock"
                          : p.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            p.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                        {!p.inStock && (
                          <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            No stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          aria-label={`Edit ${p.title}`}
                          className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          aria-label={`Delete ${p.title}`}
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
