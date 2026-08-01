"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  ChevronRight,
  Package,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { CURRENCY } from "@/lib/data";
import {
  orderItemCount,
  orderStatusStyles,
  userOrders,
  type UserOrderStatus,
} from "@/lib/order-data";

const filters: Array<"All" | UserOrderStatus> = [
  "All",
  "Processing",
  "On the way",
  "Completed",
  "Cancelled",
];

const statusSummary: Record<
  string,
  { label: string; className: string }
> = {
  "On the way": { label: "On the way", className: "bg-blue-100 text-blue-700" },
  Processing: { label: "Processing", className: "bg-amber-100 text-amber-700" },
  Completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
  Cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default function OrdersPage() {
  const [active, setActive] = useState<"All" | UserOrderStatus>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return userOrders.filter((order) => {
      const matchesStatus = active === "All" || order.status === active;
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.items.some((item) => item.title.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [active, query]);

  const stats = useMemo(() => {
    const activeOrders = userOrders.filter(
      (o) => o.status !== "Completed" && o.status !== "Cancelled"
    ).length;
    const totalSpent = userOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce(
        (sum, o) =>
          sum +
          o.items.reduce((s, i) => s + i.qty * i.price, 0) +
          o.delivery,
        0
      );
    return { total: userOrders.length, active: activeOrders, totalSpent };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Order History" }]} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
            Order History
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Track, review, and reorder everything you&apos;ve bought.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
        >
          <Boxes size={15} />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Orders
          </p>
          <p className="mt-1 text-2xl font-extrabold text-neutral-900">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            In Progress
          </p>
          <p className="mt-1 text-2xl font-extrabold text-neutral-900">
            {stats.active}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Spent
          </p>
          <p className="mt-1 text-2xl font-extrabold text-neutral-900">
            {CURRENCY}
            {stats.totalSpent.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                active === filter
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or product"
            className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 sm:w-72"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 py-16 text-center">
          <Package size={36} className="text-neutral-300" />
          <p className="mt-4 text-lg font-bold text-neutral-900">
            No orders found
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            {query
              ? "Try a different search term or filter."
              : "Once you place an order, it will show up here."}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((order) => {
            const itemCount = orderItemCount(order);
            const badge = statusSummary[order.status] ?? orderStatusStyles[order.status];
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id.replace("#", "")}`}
                className="group block rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-sm font-bold text-neutral-900">
                        {order.id}
                      </p>
                      <span className="text-xs text-neutral-400">
                        {order.date}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${badge}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm text-neutral-600">
                      {itemCount} item{itemCount > 1 ? "s" : ""} ·{" "}
                      {order.items[0]?.title}
                      {order.items.length > 1
                        ? ` +${order.items.length - 1} more`
                        : ""}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
                      <Wallet size={12} />
                      {order.payment}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-6 lg:justify-end">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-neutral-400">
                        Total
                      </p>
                      <p className="text-lg font-extrabold text-neutral-900">
                        {CURRENCY}
                        {(
                          order.items.reduce(
                            (s, i) => s + i.qty * i.price,
                            0
                          ) + order.delivery
                        ).toLocaleString()}
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-8 flex items-center gap-2 text-xs text-neutral-400">
        <ShieldCheck size={14} />
        All orders are covered by our delivery and return policy.
      </p>
    </div>
  );
}
