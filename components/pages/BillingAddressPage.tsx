"use client";

import { useState } from "react";
import { Check, Loader2, MapPin } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

const EMPTY_ADDRESS: Address = {
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  phone: "",
};

const STORAGE_KEY = "tobarok-billing-address";

function loadAddress(): Address | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Address) : null;
  } catch {
    return null;
  }
}

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

export default function BillingAddressPage() {
  const [saved, setSaved] = useState<Address | null>(() => loadAddress());
  const [form, setForm] = useState<Address>(() => loadAddress() ?? EMPTY_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const update = (field: keyof Address) => (value: string) => {
    setForm((cur) => ({ ...cur, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSaved(form);
    setMessage("Billing address saved successfully");
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Billing Address" }]} />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        Billing Address
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-neutral-400" />
              <h2 className="text-base font-bold text-neutral-900">
                Edit Billing Address
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName")(e.target.value)}
                  placeholder="John Doe"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => update("phone")(e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Address Line 1
                </label>
                <input
                  type="text"
                  required
                  value={form.addressLine1}
                  onChange={(e) => update("addressLine1")(e.target.value)}
                  placeholder="House, street, area"
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Address Line 2
                  <span className="ml-1 font-normal normal-case text-neutral-400">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) => update("addressLine2")(e.target.value)}
                  placeholder="Apartment, suite, unit"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => update("city")(e.target.value)}
                  placeholder="Dhaka"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  State / Division
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => update("state")(e.target.value)}
                  placeholder="Dhaka"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={form.zip}
                  onChange={(e) => update("zip")(e.target.value)}
                  placeholder="1212"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={form.country}
                  onChange={(e) => update("country")(e.target.value)}
                  placeholder="Bangladesh"
                  className={inputCls}
                />
              </div>
            </div>

            {message && (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Check size={16} />
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Save Address
            </button>
          </form>
        </div>

        <div className="h-fit rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Saved Address
          </span>
          {saved ? (
            <address className="mt-3 text-sm not-italic leading-relaxed text-neutral-600">
              <p className="font-bold text-neutral-900">{saved.fullName}</p>
              <p>
                {saved.addressLine1}
                {saved.addressLine2 ? `, ${saved.addressLine2}` : ""}
              </p>
              <p>
                {saved.city}
                {saved.state ? `, ${saved.state}` : ""} {saved.zip}
              </p>
              <p>{saved.country}</p>
              <p className="mt-2 text-neutral-500">{saved.phone}</p>
            </address>
          ) : (
            <p className="mt-3 text-sm text-neutral-400">
              No address saved yet. Fill in the form to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
