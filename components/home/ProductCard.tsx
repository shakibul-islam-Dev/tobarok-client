"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { CURRENCY, type Product } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";
import { useStore } from "@/components/store/StoreProvider";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);
  return (
    <div className="group relative">
      <Link
        href={`/product/${product.id}`}
        className="relative block overflow-hidden rounded-xl bg-neutral-100"
      >
        <div className="aspect-square w-full">
          <SmartImage
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 260px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded bg-neutral-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all ${
            wishlisted
              ? "bg-neutral-900 text-white"
              : "bg-white/90 text-neutral-900 opacity-0 hover:bg-white group-hover:opacity-100"
          }`}
        >
          <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="pt-2.5">
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 block min-h-[2.5rem] text-sm font-medium leading-snug text-neutral-800 transition-colors hover:text-neutral-500"
        >
          {product.title}
        </Link>
        <p className="mt-1.5 flex items-baseline gap-2 text-sm">
          {product.originalPrice && (
            <del className="text-neutral-400">
              {formatPrice(product.originalPrice)}
            </del>
          )}
          <span className="font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
        </p>
        <Link
          href={`/product/${product.id}`}
          className="mt-2.5 block w-full rounded-lg border border-neutral-200 bg-white py-2 text-center text-[11px] font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          Select Size
        </Link>
      </div>
    </div>
  );
}
