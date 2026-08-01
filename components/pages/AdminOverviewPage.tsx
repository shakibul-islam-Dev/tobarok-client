"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  Check,
  FolderTree,
  Loader2,
  MapPin,
  PackageCheck,
  Plus,
  Receipt,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import AdminShell from "./AdminShell";
import ProductForm from "./admin/ProductForm";
import SmartImage from "@/components/ui/SmartImage";
import { admin, useSession } from "@/lib/auth-client";
import { roleLabel } from "@/lib/permissions";
import {
  fetchAdminOrders,
  fetchCategories,
  fetchHeroSlides,
  fetchOutlets,
  fetchProducts,
  type ApiCategory,
  type ApiProduct,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";

interface Stats {
  products: number;
  categories: number;
  heroSlides: number;
  outlets: number;
  orders: number;
  users: number;
  lowStock: number;
  outOfStock: number;
}

export default function AdminOverviewPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats, heroSlides, outlets, ordersRes, usersRes] =
        await Promise.all([
          fetchProducts({ limit: "6", active: "false" }),
          fetchCategories({ active: "false" }),
          fetchHeroSlides(),
          fetchOutlets(),
          fetchAdminOrders({ limit: "1" }),
          admin.listUsers({ query: { limit: 1 } }),
        ]);
      setProducts(prods.products);
      setCategories(cats);
      setStats({
        products: prods.pagination.total,
        categories: cats.length,
        heroSlides: heroSlides.length,
        outlets: outlets.length,
        orders: ordersRes.pagination.total,
        users: usersRes.data?.total ?? 0,
        lowStock: prods.products.filter(
          (p) => p.stockQuantity > 0 && p.stockQuantity <= 5
        ).length,
        outOfStock: prods.products.filter((p) => p.stockQuantity === 0).length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prods, cats, heroSlides, outlets, ordersRes, usersRes] =
          await Promise.all([
            fetchProducts({ limit: "6", active: "false" }),
            fetchCategories({ active: "false" }),
            fetchHeroSlides(),
            fetchOutlets(),
            fetchAdminOrders({ limit: "1" }),
            admin.listUsers({ query: { limit: 1 } }),
          ]);
        if (cancelled) return;
        setProducts(prods.products);
        setCategories(cats);
        setStats({
          products: prods.pagination.total,
          categories: cats.length,
          heroSlides: heroSlides.length,
          outlets: outlets.length,
          orders: ordersRes.pagination.total,
          users: usersRes.data?.total ?? 0,
          lowStock: prods.products.filter(
            (p) => p.stockQuantity > 0 && p.stockQuantity <= 5
          ).length,
          outOfStock: prods.products.filter((p) => p.stockQuantity === 0).length,
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load dashboard"
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

  const handleSaved = () => {
    setMessage("Product added to the database");
    window.setTimeout(() => setMessage(null), 3000);
    setShowForm(false);
    load();
  };

  const statCards = stats
    ? [
        {
          label: "Products",
          value: stats.products,
          icon: Boxes,
          href: "/admin/products",
        },
        {
          label: "Categories",
          value: stats.categories,
          icon: FolderTree,
          href: "/admin/categories",
        },
        {
          label: "Hero Slides",
          value: stats.heroSlides,
          icon: SlidersHorizontal,
          href: "/admin/hero-slides",
        },
        {
          label: "Outlets",
          value: stats.outlets,
          icon: MapPin,
          href: "/admin/outlets",
        },
        {
          label: "Orders",
          value: stats.orders,
          icon: Receipt,
          href: "/admin/orders",
        },
        {
          label: "Users",
          value: stats.users,
          icon: Users,
          href: "/admin/users",
        },
      ]
    : [];

  return (
    <AdminShell crumbLabel="Dashboard">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track your store in real time and add new products right from here.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          <Sparkles size={11} />
          {roleLabel(session?.user.role)}
        </span>
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

      {/* Live stats */}
      <section className="mt-6">
        {loading || !stats ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200/80 bg-white py-16 text-neutral-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm">Loading dashboard…</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="group rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-colors hover:border-neutral-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        {stat.label}
                      </span>
                      <Icon
                        size={17}
                        className="text-neutral-300 transition-colors group-hover:text-neutral-900"
                      />
                    </div>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
                      {stat.value}
                    </p>
                  </Link>
                );
              })}
            </div>

            {(stats.outOfStock > 0 || stats.lowStock > 0) && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertTriangle size={16} className="shrink-0" />
                <span>
                  <strong>{stats.outOfStock}</strong> product
                  {stats.outOfStock === 1 ? " is" : "s are"} out of stock,{" "}
                  <strong>{stats.lowStock}</strong> low on stock.
                </span>
                <Link
                  href="/admin/products"
                  className="ml-auto font-bold uppercase tracking-wider text-amber-800 underline"
                >
                  Review stock
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Quick add + recent products */}
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              {showForm ? "Add New Product" : "Quick Add Product"}
            </h2>
            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
              >
                <Plus size={15} />
                Add Product
              </button>
            )}
          </div>
          {showForm ? (
            <ProductForm
              key="quick-add"
              categories={categories}
              onSaved={handleSaved}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 p-10 text-center text-sm text-neutral-500">
              Click{" "}
              <span className="font-bold text-neutral-900">Add Product</span> to
              open the form — title, description, category, sizes, price,
              discount, points for buy and more.
            </div>
          )}
        </div>

        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Recent Products
            </h2>
            <Link
              href="/admin/products"
              className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-neutral-400">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Loading…</span>
              </div>
            ) : products.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-neutral-400">
                No products yet.
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {products.map((p) => (
                  <li key={p._id} className="flex items-center gap-3 px-5 py-4">
                    <SmartImage
                      src={p.image}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {p.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {p.category || "Uncategorized"} · ৳
                        {p.price.toLocaleString()}
                        {p.pointsReward
                          ? ` · ${p.pointsReward} pts`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                        p.stockQuantity === 0
                          ? "bg-red-100 text-red-700"
                          : p.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-neutral-100 text-neutral-500"
                      )}
                    >
                      {p.stockQuantity === 0
                        ? "Out of stock"
                        : p.isActive
                          ? "Active"
                          : "Inactive"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4 rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <PackageCheck size={16} className="text-neutral-400" />
              <h3 className="text-sm font-bold text-neutral-900">
                Store Management
              </h3>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Manage categories, hero slides, outlets, orders and approvals from
              the panel.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: "Categories", href: "/admin/categories" },
                { label: "Hero Slides", href: "/admin/hero-slides" },
                { label: "Outlets", href: "/admin/outlets" },
                { label: "Orders", href: "/admin/orders" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
