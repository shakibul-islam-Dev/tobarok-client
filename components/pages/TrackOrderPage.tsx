"use client";

import { useState } from "react";
import { Check, Package, Search, Truck } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTracking(true);
  };

  const steps = [
    { label: "Order Confirmed", done: true },
    { label: "Processing", done: true },
    { label: "Out for Delivery", done: true },
    { label: "Delivered", done: false },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Track Order" }]} />
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
          Track Your Order
        </h1>
        <p className="mt-3 text-center text-sm text-neutral-500">
          Enter your order ID and the phone number you used while ordering.
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
              placeholder="Order ID (e.g. TB-1024)"
              className={`${inputCls} pl-11`}
            />
          </div>
          <input
            type="tel"
            required
            placeholder="Phone number"
            className={inputCls}
          />
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
          >
            <Search size={15} />
            Track Order
          </button>
        </form>

        {tracking && (
          <div className="mt-8 rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-neutral-900">
                Order{" "}
                <span className="text-neutral-500">
                  {orderId || "TB-1024"}
                </span>
              </p>
              <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
                On the way
              </span>
            </div>
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
                    {step.done ? (
                      <Check size={14} />
                    ) : (
                      <Truck size={14} />
                    )}
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
                          ? "Jul 28, 2026 - 10:12 AM"
                          : i === 1
                            ? "Jul 29, 2026 - 02:40 PM"
                            : "Jul 31, 2026 - 09:05 AM"
                        : "Expected today by 8:00 PM"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-lg bg-neutral-100 p-3 text-xs text-neutral-500">
              This is a demo tracker. Connect it to your order API to show
              real-time updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
