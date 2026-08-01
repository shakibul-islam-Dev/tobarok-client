"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Boxes,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  LayoutGrid,
  Loader2,
  LogOut,
  MapPin,
  PackageCheck,
  Receipt,
  RefreshCw,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
  UserCog,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { admin, signOut, useSession } from "@/lib/auth-client";
import { hasRole, roleLabel } from "@/lib/permissions";
import { initialOrders, initialProducts } from "@/lib/admin-data";
import { formatMoney } from "@/lib/transactions";
import { useWalletLedger } from "@/lib/use-ledger";
import { cn } from "@/lib/utils";
import {
  orderItemCount,
  orderStatusStyles,
  userOrders,
} from "@/lib/order-data";

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const userNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Order History", href: "/orders", icon: RefreshCw },
  { label: "Billing Address", href: "/billing-address", icon: MapPin },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Profile Update", href: "/profile", icon: UserRound },
];

const adminNavItems = [
  { label: "Admin Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Products", href: "/admin/products", icon: Boxes },
  {
    label: "Approvals",
    href: "/admin/products/approvals",
    icon: ClipboardCheck,
  },
  { label: "Sales & Orders", href: "/admin/orders", icon: Receipt },
];

interface Stats {
  total: number;
  users: number;
  admins: number;
  banned: number;
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function RoleBadge({
  role,
  isAdmin,
  isSuper,
}: {
  role: string | null | undefined;
  isAdmin: boolean;
  isSuper: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
        isSuper
          ? "bg-purple-100 text-purple-700"
          : isAdmin
            ? "bg-emerald-100 text-emerald-700"
            : "bg-neutral-100 text-neutral-600"
      )}
    >
      {isSuper && <Sparkles size={11} />}
      {roleLabel(role)}
    </span>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const { balance: walletBalance } = useWalletLedger();

  const role = session?.user.role;
  const isAdmin = hasRole(role, "admin");
  const isSuper = hasRole(role, "superadmin");

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(isAdmin);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    const load = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const { data, error: resError } = await admin.listUsers({
          query: { limit: 100 },
        });
        if (cancelled) return;
        if (resError) {
          setStatsError(resError.message ?? "Could not load users");
          return;
        }
        const users = data?.users ?? [];
        setStats({
          total: data?.total ?? users.length,
          users: users.filter((u) => !hasRole(u.role, "admin")).length,
          admins: users.filter((u) => hasRole(u.role, "admin")).length,
          banned: users.filter((u) => u.banned).length,
        });
      } catch (err) {
        if (!cancelled) {
          setStatsError(
            err instanceof Error ? err.message : "Something went wrong"
          );
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  // Greeting is time-based; the element opts out of hydration so the client
  // value always reflects the user's actual local time.
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const firstName = (session?.user.name ?? "there").split(" ")[0];

  // Customer quick stats (live wallet balance + demo order figures).
  const activeOrders = userOrders.filter((o) => o.status !== "Cancelled");
  const userStats = [
    {
      label: "Wallet Balance",
      value: formatMoney(walletBalance),
      icon: Wallet,
      href: "/wallet",
    },
    {
      label: "Total Orders",
      value: userOrders.length,
      icon: PackageCheck,
      href: "/orders",
    },
    {
      label: "Items Purchased",
      value: activeOrders.reduce(
        (sum, o) => sum + orderItemCount(o),
        0
      ),
      icon: ShoppingBag,
      href: "/orders",
    },
    {
      label: "Total Spent",
      value: formatMoney(
        activeOrders.reduce(
          (sum, o) =>
            sum +
            o.items.reduce((s, i) => s + i.qty * i.price, 0) +
            o.delivery,
          0
        )
      ),
      icon: Receipt,
      href: "/orders",
    },
  ];

  // Admin quick stats (from the store mock data).
  const pendingApprovals = initialProducts.filter(
    (p) => p.status === "pending"
  ).length;
  const revenue = initialOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const adminStats = [
    { label: "Products", value: initialProducts.length, icon: Boxes, href: "/admin/products" },
    {
      label: "Pending Approvals",
      value: pendingApprovals,
      icon: ClipboardCheck,
      href: "/admin/products/approvals",
    },
    {
      label: "Total Orders",
      value: initialOrders.length,
      icon: PackageCheck,
      href: "/admin/orders",
    },
    { label: "Revenue", value: formatMoney(revenue), icon: Receipt, href: "/admin/orders" },
  ];

  const adminModules = [
    {
      title: "Products",
      description: "Input items, update stock and manage the catalog.",
      href: "/admin/products",
      icon: Boxes,
    },
    {
      title: "Product Approvals",
      description: `${pendingApprovals} item${pendingApprovals === 1 ? "" : "s"} waiting for approval.`,
      href: "/admin/products/approvals",
      icon: ClipboardCheck,
      badge: pendingApprovals > 0 ? pendingApprovals : undefined,
    },
    {
      title: "Sales & Orders",
      description: "Track sales and update order statuses.",
      href: "/admin/orders",
      icon: Receipt,
    },
  ];

  const name = session?.user.name ?? "Customer";
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* ---- Sidebar navigation ---- */}
        <aside className="h-fit overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm lg:sticky lg:top-6">
          <div className="border-b border-neutral-100 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-neutral-900">
                  {name}
                </p>
                <p className="truncate text-xs text-neutral-400">
                  {session?.user.email ?? ""}
                </p>
              </div>
            </div>
          </div>
          <nav className="py-2">
            {isAdmin && (
              <div className="px-5 pb-1 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Store Management
                </span>
              </div>
            )}
            {isAdmin &&
              adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    <Icon
                      size={18}
                      className="text-neutral-400 transition-colors group-hover:text-neutral-900"
                    />
                    {item.label}
                    {item.href === "/admin/products/approvals" &&
                      pendingApprovals > 0 && (
                        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          {pendingApprovals}
                        </span>
                      )}
                  </Link>
                );
              })}
            {isSuper && (
              <Link
                href="/admin/users"
                className="group flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                <UserCog
                  size={18}
                  className="text-neutral-400 transition-colors group-hover:text-neutral-900"
                />
                Users
              </Link>
            )}
            <div className="px-5 pb-1 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                My Account
              </span>
            </div>
            {userNavItems.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/dashboard";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors",
                    active
                      ? "border-l-4 border-emerald-500 bg-neutral-100/70 text-neutral-900"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <Icon
                    size={18}
                    className={
                      active ? "text-neutral-900" : "text-neutral-400"
                    }
                  />
                  {item.label}
                </Link>
              );
            })}
            <div className="mx-5 my-2 border-t border-neutral-100" />
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={18} className="text-red-500" />
              Log out
            </button>
          </nav>
        </aside>

        {/* ---- Main content ---- */}
        <div className="space-y-6 lg:col-span-3">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1
                suppressHydrationWarning
                className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl"
              >
                {greeting}, {firstName}
              </h1>
              <p
                suppressHydrationWarning
                className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500"
              >
                <Calendar size={14} />
                {today}
              </p>
            </div>
            <RoleBadge role={role} isAdmin={isAdmin} isSuper={isSuper} />
          </div>

          {/* Quick stats */}
          <section>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {(isAdmin ? adminStats : userStats).map((stat) => {
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
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                      {stat.value}
                    </p>
                  </Link>
                );
              })}
            </div>
            {isAdmin && statsError && (
              <p className="mt-3 text-xs text-red-600">{statsError}</p>
            )}
          </section>

          {/* Admin: module shortcuts */}
          {isAdmin && (
            <section className="space-y-4 rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                  <Shield size={18} className="text-neutral-400" />
                  Store Management
                </h2>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Open panel <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {adminModules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <Link
                      key={mod.href}
                      href={mod.href}
                      className="group relative rounded-xl border border-neutral-200/80 p-5 transition-colors hover:border-neutral-900"
                    >
                      {mod.badge && (
                        <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          {mod.badge} pending
                        </span>
                      )}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white">
                        <Icon size={18} />
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-neutral-900">
                        {mod.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                        {mod.description}
                      </p>
                    </Link>
                  );
                })}
              </div>

              {/* Superadmin: user management */}
              {isSuper ? (
                <div className="flex flex-col gap-3 rounded-xl border border-purple-200 bg-purple-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                      <UserCog size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        User Management
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        Full control — change roles, ban users, manage sessions.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/admin/users"
                    className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
                  >
                    Manage Users
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        User Stats
                      </p>
                      {statsLoading ? (
                        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                          <Loader2 size={14} className="animate-spin" />
                          Loading…
                        </div>
                      ) : (
                        <div className="mt-1.5 grid grid-cols-3 gap-x-6 gap-y-1 text-xs text-neutral-600">
                          <span>
                            Total:{" "}
                            <strong className="text-neutral-900">
                              {stats?.total ?? "—"}
                            </strong>
                          </span>
                          <span>
                            Admins:{" "}
                            <strong className="text-neutral-900">
                              {stats?.admins ?? "—"}
                            </strong>
                          </span>
                          <span>
                            Banned:{" "}
                            <strong className="text-neutral-900">
                              {stats?.banned ?? "—"}
                            </strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/admin/users"
                    className="shrink-0 rounded-full border border-neutral-200 bg-white px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-900"
                  >
                    Manage Users
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Profile + Wallet */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200/80 bg-white p-6 text-center shadow-sm">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 text-3xl font-extrabold text-white">
                {initials}
              </div>
              <h3 className="mt-4 text-xl font-bold text-neutral-900">{name}</h3>
              <p className="mt-0.5 text-xs text-neutral-400">
                {session?.user.email ?? ""}
              </p>
              <RoleBadge role={role} isAdmin={isAdmin} isSuper={isSuper} />
              <Link
                href="/profile"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                Edit Profile <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
              <div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  <Wallet size={14} /> WALLET BALANCE
                </span>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
                  {formatMoney(walletBalance)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                  Use your balance at checkout, or top up to keep shopping.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/wallet"
                  className="rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
                >
                  Manage Wallet
                </Link>
                <Link
                  href="/billing-address"
                  className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-900"
                >
                  Edit Address
                </Link>
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-lg font-bold text-neutral-900">
                Recent Order History
              </h2>
              <Link
                href="/orders"
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                View All <ChevronRight size={15} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead>
                  <tr className="bg-neutral-100/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    <th scope="col" className="px-6 py-3.5">
                      ORDER
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      DATE
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      ITEMS
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      TOTAL
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      STATUS
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {userOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4 font-semibold text-neutral-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-neutral-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-neutral-500">
                        {orderItemCount(order)} item
                        {orderItemCount(order) > 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 font-semibold text-neutral-900">
                        {formatMoney(
                          order.items.reduce(
                            (s, i) => s + i.qty * i.price,
                            0
                          ) + order.delivery
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                            orderStatusStyles[order.status]
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              order.status === "Completed"
                                ? "bg-emerald-500"
                                : order.status === "Cancelled"
                                  ? "bg-red-500"
                                  : order.status === "On the way"
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                            )}
                          />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/orders/${order.id.replace("#", "")}`}
                          className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Help strip */}
          <div className="flex flex-col gap-3 rounded-xl border border-neutral-200/80 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  Need help with an order?
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Track your delivery or get in touch with our support team.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/track"
                className="rounded-full border border-neutral-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-900"
              >
                Track Order
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
