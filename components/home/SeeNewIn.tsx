"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CURRENCY, newInList, seeProducts, type Product } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

const tabs: { key: string; label: string; products: Product[] }[] = [
  { key: "see", label: "SEE", products: seeProducts },
  { key: "new", label: "NEW IN", products: newInList },
];

export default function SeeNewIn() {
  const [active, setActive] = useState(tabs[0].key);
  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="mb-8 flex justify-center gap-2.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`rounded-full border px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                active === tab.key
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5"
          >
            {activeTab.products.map((product) => (
              <Link
                key={`${activeTab.key}-${product.id}`}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-neutral-100">
                  <div className="aspect-square w-full">
                    <SmartImage
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-medium leading-snug text-neutral-800 transition-colors group-hover:text-neutral-500 sm:text-sm">
                  {product.title}
                </p>
                <p className="mt-1 flex items-baseline gap-1.5 text-xs sm:text-sm">
                  {product.originalPrice && (
                    <del className="text-neutral-400">
                      {formatPrice(product.originalPrice)}
                    </del>
                  )}
                  <span className="font-bold text-neutral-900">
                    {formatPrice(product.price)}
                  </span>
                </p>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
