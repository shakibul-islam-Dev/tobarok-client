"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

const productTypes = [
  "Drop Shoulder T-Shirt",
  "Half Sleeve T-Shirt",
  "Full Sleeve T-Shirt",
  "Polo",
  "Hoodie",
  "Sweatshirt",
  "Cap / Accessories",
  "Other",
];

export default function CustomPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Custom / Bulk" }]} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
            Custom &amp; Bulk Orders
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-600 sm:text-base">
            Looking for custom tees, corporate uniforms or bulk orders? Share
            your requirement and our team will craft it for you — from design to
            delivery.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-neutral-600">
            {[
              "Corporate & team uniforms",
              "Event / fest custom t-shirts",
              "Printed & embroidered designs",
              "Minimum order from 10 pieces",
              "Free design consultation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Check size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-50 p-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
              <Check size={24} />
            </span>
            <h2 className="mt-4 text-xl font-bold text-neutral-900">
              Request received!
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Our team will contact you within 24 hours with a quote.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4 rounded-2xl border border-neutral-200 p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Your name" className={inputCls} />
              <input
                required
                type="tel"
                placeholder="Phone number"
                className={inputCls}
              />
            </div>
            <select required defaultValue="" className={inputCls}>
              <option value="" disabled>
                Select product type
              </option>
              {productTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <input
              required
              type="number"
              min={10}
              placeholder="Quantity (min 10)"
              className={inputCls}
            />
            <textarea
              rows={4}
              placeholder="Describe your design / requirement..."
              className={inputCls}
            />
            <label className="block cursor-pointer rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500 transition-colors hover:border-neutral-900">
              Attach design file (optional)
              <input type="file" className="hidden" />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
