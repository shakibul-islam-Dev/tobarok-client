"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "FAQs" }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-center text-sm text-neutral-500">
          Everything you need to know about ordering from tobarok.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="overflow-hidden rounded-xl border border-neutral-200"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 bg-white px-5 py-4 text-left text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
              >
                {faq.q}
                <ChevronDown
                  size={17}
                  className={`shrink-0 text-neutral-400 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-neutral-600">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
