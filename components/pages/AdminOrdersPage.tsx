"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign, Loader2, Receipt, TrendingUp } from "lucide-react";
import AdminShell from "./AdminShell";
import {
  initialOrders,
  orderStatusLabel,
  type AdminOrder,
  type OrderStatus,
} from "@/lib/admin-data";

const orderStatuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const matchesStatus = filter === "all" || o.status === filter;
        const matchesSearch =
          !search ||
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [orders, filter, search]
  );

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== "cancelled");
    const revenue = active.reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    return { total: orders.length, revenue, pending };
  }, [orders]);

  const handleStatus = (id: string, status: OrderStatus) => {
    setBusyId(id);
    window.setTimeout(() => {
      setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status } : o)));
      setBusyId(null);
    }, 250);
  };

  return (
    <AdminShell crumbLabel="Sales & Orders">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
          Sales & Orders
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track sales and update order statuses.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400">
            <Receipt size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Total Orders
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400">
            <TrendingUp size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Revenue
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600">
            ৳{stats.revenue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400">
            <CircleDollarSign size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Pending
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-amber-600">
            {stats.pending}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", ...orderStatuses] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === s
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {s === "all" ? "All" : orderStatusLabel[s]}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order ID or customer…"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900 sm:max-w-xs"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-neutral-100/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                <th scope="col" className="px-6 py-3.5">
                  Order
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Items
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Total
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Date
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-neutral-400"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50/50">
                  <td className="px-6 py-4 font-semibold text-neutral-900">
                    {o.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-900">
                      {o.customer}
                    </p>
                    <p className="text-xs text-neutral-400">{o.email}</p>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {o.items} item{o.items > 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">
                    ৳{o.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-500">
                    {o.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <select
                        value={o.status}
                        disabled={busyId === o.id}
                        onChange={(e) =>
                          handleStatus(o.id, e.target.value as OrderStatus)
                        }
                        className={`cursor-pointer rounded-full border py-1.5 pl-3 pr-8 text-xs font-bold uppercase tracking-wider outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          o.status === "cancelled"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : o.status === "delivered"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {orderStatuses.map((s) => (
                          <option key={s} value={s}>
                            {orderStatusLabel[s]}
                          </option>
                        ))}
                      </select>
                      {busyId === o.id && (
                        <Loader2
                          size={12}
                          className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-neutral-400"
                        />
                      )}
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
