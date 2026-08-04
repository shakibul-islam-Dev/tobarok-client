"use client";

import { useState } from "react";
import { Check, Package, Search, Truck } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { CURRENCY } from "@/lib/data";
import {
  getOrderById,
  orderItemCount,
  orderStatusStyles,
  orderSubtotal,
  type UserOrder,
  type UserOrderStatus,
} from "@/lib/order-data";

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

const steps = [
  { label: "Order Confirmed" },
  { label: "Processing" },
  { label: "Out for Delivery" },
  { label: "Delivered" },
];

function doneIndex(status: UserOrderStatus): number {
  switch (status) {
    case "On the way":
      return 2;
    case "Completed":
    case "Cancelled":
      return 3;
    default:
      return 0;
  }
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [order, setOrder] = useState<UserOrder | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = orderId.replace(/^#/, "").trim().toLowerCase();
    setTracking(true);
    setOrder(getOrderById(id) ?? null);
  };

  const done = order ? doneIndex(order.status) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Track Order" }]} />
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
          Track Your Order
        </h1>
        <p className="mt-3 text-center text-sm text-neutral-500">
          Enter your order ID to see the latest status.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl bg-neutral-50 p-6"
        >
          <div className="relative">
            <Package
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              required
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setTracking(false);
              }}
              placeholder="Order ID"
              className={`${inputCls} pl-11`}
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
          >
            <Search size={15} />
            Track Order
          </button>
        </form>

        {tracking && !order && (
          <div className="mt-8 rounded-2xl border border-neutral-200 p-6 text-center">
            <p className="text-sm font-bold text-neutral-900">
              No order found
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Double-check the order ID and try again.
            </p>
          </div>
        )}

        {tracking && order && (
          <div className="mt-8 rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-neutral-900">
                Order <span className="text-neutral-500">#{order.id}</span>
              </p>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${orderStatusStyles[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Placed on {order.date} • {orderItemCount(order)}{" "}
              {orderItemCount(order) === 1 ? "item" : "items"} •{" "}
              {formatPrice(orderSubtotal(order))}
            </p>
            <ol className="mt-6 space-y-5">
              {steps.map((step, i) => {
                const isDone = i <= done;
                return (
                  <li key={step.label} className="flex items-start gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        isDone
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-300 text-neutral-400"
                      }`}
                    >
                      {isDone ? <Check size={14} /> : <Truck size={14} />}
                    </span>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDone ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
