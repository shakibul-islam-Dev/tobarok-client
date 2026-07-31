"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Heart, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { CURRENCY, sizes, type Product } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/home/ProductCard";
import { useStore } from "@/components/store/StoreProvider";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

interface ProductPageProps {
  product: Product;
  related: Product[];
}

export default function ProductPage({ product, related }: ProductPageProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [size, setSize] = useState(sizes[2]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.title },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
          <div className="aspect-square w-full">
            <SmartImage
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {product.badge && (
            <span className="absolute left-4 top-4 rounded bg-neutral-900 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            {product.title}
          </h1>

          <div className="mt-3 flex items-baseline gap-3">
            {product.originalPrice && (
              <del className="text-lg text-neutral-400">
                {formatPrice(product.originalPrice)}
              </del>
            )}
            <span className="text-2xl font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Premium quality fabric, perfect fit and built to last. This piece is
            part of the {product.badge ? product.badge : "tobarok"} collection —
            made with pride in Bangladesh.
          </p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-900">
              Select Size
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                    size === s
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-lg border border-neutral-200">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-10 items-center justify-center text-neutral-700 hover:text-black"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-bold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="flex h-11 w-10 items-center justify-center text-neutral-700 hover:text-black"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg px-6 text-xs font-bold uppercase tracking-widest transition-colors ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              {added ? <Check size={16} /> : <ShoppingBag size={16} />}
              {added ? "Added to Cart" : "Add to Cart"}
            </button>

            <button
              type="button"
              aria-label="Toggle wishlist"
              onClick={() => toggleWishlist(product.id)}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                wishlisted
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-700 hover:border-neutral-900"
              }`}
            >
              <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
            <Truck size={18} className="mt-0.5 shrink-0 text-neutral-900" />
            <p>
              Cash on delivery available across Bangladesh. Free delivery on
              orders over ৳1,500. Deliveries in Dhaka within 24–72 hours.
            </p>
          </div>

          <dl className="mt-6 space-y-2 border-t border-neutral-200 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">SKU</dt>
              <dd className="font-medium text-neutral-900">
                TB-{String(product.id).padStart(4, "0")}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Availability</dt>
              <dd className="font-medium text-green-700">In Stock</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Fabric</dt>
              <dd className="font-medium text-neutral-900">Premium Cotton</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 border-t border-neutral-200 pt-10 md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-neutral-900">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600">
            Cut for an oversized, relaxed fit with a premium drop shoulder.
            Breathable cotton keeps you cool all day while the durable stitching
            holds its shape wash after wash.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-neutral-900">
            Care Instructions
          </h3>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-neutral-600">
            <li>Machine wash cold with similar colours</li>
            <li>Do not bleach</li>
            <li>Dry in shade, do not tumble dry</li>
            <li>Iron on low heat if needed</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-neutral-900">
            Shipping &amp; Returns
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600">
            Ships within 24 hours. Dhaka: 24–72 hrs, outside Dhaka: 3–5 days.
            Unworn items with tags can be exchanged within 7 days of delivery.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14 border-t border-neutral-200 pt-10">
          <h2 className="mb-6 text-xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-2xl">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="text-xs font-bold uppercase tracking-widest text-neutral-900 underline-offset-4 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
