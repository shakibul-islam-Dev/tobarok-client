"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BackButton from "@/components/ui/BackButton";
import SmartImage from "@/components/ui/SmartImage";
import { CURRENCY } from "@/lib/data";
import {
  orderItemCount,
  orderStatusStyles,
  type UserOrder,
} from "@/lib/order-data";

const paymentIcon = {
  COD: <Wallet size={13} />,
  bKash: <Wallet size={13} />,
  Wallet: <Wallet size={13} />,
};

export default function OrderDetailPage({ order }: { order: UserOrder }) {
  const items = order.items;
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal + order.delivery;
  const badge = orderStatusStyles[order.status];

  const steps =
    order.status === "Cancelled"
      ? []
      : [
          { label: "Order Confirmed", done: true },
          { label: "Processing", done: order.status !== "Processing" },
          {
            label: "Out for Delivery",
            done: order.status === "On the way" || order.status === "Completed",
          },
          { label: "Delivered", done: order.status === "Completed" },
        ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: "Order History", href: "/orders" },
          { label: `Order ${order.id}` },
        ]}
      />

      <div className="-mt-2 mb-4">
        <BackButton fallbackHref="/orders" label="Back to Orders" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
              Order {order.id}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${badge}`}
            >
              {order.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            Placed on {order.date} · {orderItemCount(order)} item
            {orderItemCount(order) > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/track"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
          >
            <Truck size={15} />
            Track Order
          </Link>
        </div>
      </div>

      {order.status === "Cancelled" && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
          <XCircle size={22} className="mt-0.5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-bold text-red-700">
              This order was cancelled
            </p>
            <p className="mt-1 text-sm text-red-600">
              No payment was charged. If you paid with your wallet, the amount
              has already been refunded.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {order.status !== "Cancelled" && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Delivery Progress
              </p>
              <ol className="mt-6 space-y-5">
                {steps.map((step, i) => (
                  <li key={step.label} className="flex items-start gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        step.done
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-300 text-neutral-400"
                      }`}
                    >
                      {step.done ? <Check size={14} /> : <Truck size={14} />}
                    </span>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          step.done ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {step.done
                          ? i === 0
                            ? order.date
                            : "On schedule"
                          : i === steps.length - 1
                            ? "Expected delivery"
                            : "Next up"}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-neutral-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Items
              </p>
            </div>
            <div className="mt-4 space-y-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-200">
                    <SmartImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Qty {item.qty} · {CURRENCY}
                      {item.price.toLocaleString()} each
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-neutral-900">
                    {CURRENCY}
                    {(item.qty * item.price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-neutral-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Delivery Address
              </p>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p className="font-semibold text-neutral-900">
                {order.address.name}
              </p>
              <p className="text-neutral-600">{order.address.phone}</p>
              <p className="text-neutral-600">
                {order.address.area}, {order.address.district}
              </p>
              <p className="text-neutral-600">{order.address.email}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Order Summary
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{CURRENCY}{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600">
                <span>Delivery</span>
                <span>
                  {order.delivery === 0
                    ? "Free"
                    : `${CURRENCY}${order.delivery.toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-base font-extrabold text-neutral-900">
                <span>Total</span>
                <span>{CURRENCY}{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-neutral-100 p-3 text-xs text-neutral-500">
              {paymentIcon[order.payment]}
              Paid via {order.payment}
              {order.status === "Completed" && (
                <CheckCircle2 size={13} className="ml-auto text-emerald-600" />
              )}
            </div>

            <div className="mt-5 space-y-3">
              <Link
                href="/orders"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 py-3 text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                <ArrowLeft size={14} />
                Back to Orders
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
            <Package size={24} className="text-neutral-300" />
            <p className="mt-3 text-sm font-bold text-neutral-900">
              Need help with this order?
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Contact our support team and mention order {order.id}.
            </p>
            <Link
              href="/contact"
              className="mt-3 text-xs font-bold uppercase tracking-widest text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
