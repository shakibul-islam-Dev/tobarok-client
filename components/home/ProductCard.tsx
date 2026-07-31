"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { CURRENCY, type Product } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";
import { useStore } from "@/components/store/StoreProvider";
import QuickViewModal from "@/components/ui/QuickViewModal";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

export default function ProductCard({ product }: { product: Product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <>
      <div className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-emerald-500 hover:shadow-md active:border-emerald-600">
        <div>
          {/* Image Container */}
          <Link
            href={`/product/${product.id}`}
            className="relative block aspect-square w-full overflow-hidden rounded-lg bg-white"
          >
            <SmartImage
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 260px"
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />

            {product.badge && (
              <span className="absolute left-2 top-2 rounded bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white transition-colors group-hover:bg-emerald-600">
                {product.badge}
              </span>
            )}
          </Link>

          {/* Top Right Action Icons */}
          <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
            {/* Wishlist Button */}
            <button
              type="button"
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-all hover:bg-emerald-50 hover:text-emerald-600 active:scale-95 ${
                wishlisted ? "text-emerald-600" : "text-gray-700"
              }`}
            >
              <Heart
                size={16}
                fill={wishlisted ? "currentColor" : "none"}
                className={
                  wishlisted
                    ? "text-emerald-600"
                    : "text-gray-700 transition-colors group-hover:text-emerald-600"
                }
              />
            </button>

            {/* Quick View Button */}
            <button
              type="button"
              aria-label="View product details"
              onClick={(e) => {
                e.preventDefault();
                setIsQuickViewOpen(true);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 opacity-0 shadow-sm transition-all hover:bg-emerald-50 hover:text-emerald-600 active:scale-95 group-hover:opacity-100"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="mt-3 flex items-end justify-between">
          <div className="flex-1 pr-2">
            {/* Title */}
            <Link
              href={`/product/${product.id}`}
              className="line-clamp-1 block text-sm font-medium text-gray-800 transition-colors hover:text-emerald-600 active:text-emerald-700 group-hover:text-emerald-600"
            >
              {product.title}
            </Link>

            {/* Price */}
            <p className="mt-1 flex items-baseline gap-1.5 text-base font-bold text-gray-900">
              <span>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <del className="text-xs font-normal text-gray-400">
                  {formatPrice(product.originalPrice)}
                </del>
              )}
            </p>

            {/* Star Rating */}
            <div className="mt-1.5 flex items-center gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
              <Star size={12} className="fill-gray-200 text-gray-200" />
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/product/${product.id}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm transition-all duration-300 hover:bg-emerald-600 hover:text-white active:bg-emerald-700 active:scale-95 group-hover:bg-emerald-500 group-hover:text-white"
            aria-label="Select size"
          >
            <ShoppingBag size={18} />
          </Link>
        </div>
      </div>

      {/* Render Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
