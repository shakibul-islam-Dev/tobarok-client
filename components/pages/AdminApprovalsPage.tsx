"use client";

import { useState } from "react";
import { Check, ClipboardCheck, Loader2, X } from "lucide-react";
import AdminShell from "./AdminShell";
import SmartImage from "@/components/ui/SmartImage";
import {
  initialProducts,
  productStatusLabel,
  type AdminProduct,
  type ProductStatus,
} from "@/lib/admin-data";

interface ReviewItem {
  product: AdminProduct;
  action: "approved" | "rejected";
  at: string;
}

const reviewedSeed: ReviewItem[] = initialProducts
  .filter((p) => p.status !== "pending")
  .map((p) => ({
    product: p,
    action: p.status as "approved" | "rejected",
    at: p.createdAt,
  }));

export default function AdminApprovalsPage() {
  const [pending, setPending] = useState<AdminProduct[]>(
    initialProducts.filter((p) => p.status === "pending")
  );
  const [history, setHistory] = useState<ReviewItem[]>(reviewedSeed);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const decide = (id: string, action: "approved" | "rejected") => {
    setBusyId(id);
    window.setTimeout(() => {
      const product = pending.find((p) => p.id === id);
      if (!product) {
        setBusyId(null);
        return;
      }
      setPending((cur) => cur.filter((p) => p.id !== id));
      setHistory((cur) => [
        {
          product: { ...product, status: action },
          action,
          at: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
        ...cur,
      ]);
      setBusyId(null);
      setMessage(
        action === "approved"
          ? `"${product.title}" approved and published`
          : `"${product.title}" rejected`
      );
      window.setTimeout(() => setMessage(null), 3000);
    }, 350);
  };

  return (
    <AdminShell crumbLabel="Approvals">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
          Product Approvals
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review new items and approve them for the storefront.
        </p>
      </div>

      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check size={16} />
          {message}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900">
            <ClipboardCheck size={18} className="text-neutral-400" />
            Waiting for Approval
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              {pending.length}
            </span>
          </h2>
        </div>

        {pending.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-neutral-400">
            No items waiting for approval. Everything is up to date.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {pending.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center"
              >
                <SmartImage
                  src={p.image}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{p.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {p.category} · ৳{p.price.toLocaleString()} · Stock {p.stock} ·{" "}
                    {p.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => decide(p.id, "approved")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyId === p.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} />
                    )}
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => decide(p.id, "rejected")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={13} />
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5">
          <h2 className="text-base font-bold text-neutral-900">
            Recently Processed
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="bg-neutral-100/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                <th scope="col" className="px-6 py-3.5">
                  Product
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Decision
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {history.map((h) => (
                <tr key={h.product.id} className="hover:bg-neutral-50/50">
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {h.product.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        h.action === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {productStatusLabel[h.action as ProductStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-500">
                    {h.at}
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
