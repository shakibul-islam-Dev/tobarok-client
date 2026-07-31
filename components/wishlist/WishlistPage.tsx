"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { allProducts, CURRENCY } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useStore } from "@/components/store/StoreProvider";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

const productById = new Map(allProducts.map((p) => [p.id, p]));

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const items = wishlist
    .map((id) => productById.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-16">
        <Breadcrumb items={[{ label: "Wishlist" }]} />
        <div className="flex flex-col items-center py-16 text-center">
          <Heart size={48} className="text-neutral-300" />
          <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-neutral-900">
            Your wishlist is empty
          </h1>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            Tap the heart on any product to save it here for later.
          </p>
          <Link
            href="/shop"
            className="mt-6 rounded-full bg-neutral-900 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
          >
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Wishlist" }]} />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        My Wishlist
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        {items.length} {items.length === 1 ? "item" : "items"} saved
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((product) => (
          <div key={product.id} className="group relative">
            <Link
              href={`/product/${product.id}`}
              className="relative block overflow-hidden rounded-xl bg-neutral-100"
            >
              <div className="aspect-square w-full">
                <SmartImage
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <button
              type="button"
              aria-label="Remove from wishlist"
              onClick={() => toggleWishlist(product.id)}
              className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white"
            >
              <Heart size={15} fill="currentColor" />
            </button>
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
              <button
                type="button"
                onClick={() => addToCart(product.id)}
                className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white py-2 text-[11px] font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                <ShoppingBag size={13} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
