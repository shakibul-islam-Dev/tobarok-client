"use client";

import Link from "next/link";
import { Heart, X } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Wishlist" }]} />

      <h1 className="my-8 text-center text-3xl font-bold tracking-tight text-neutral-900">
        My Wishlist
      </h1>

      <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200/80 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                <th scope="col" className="px-6 py-4">
                  PRODUCT
                </th>
                <th scope="col" className="px-6 py-4">
                  PRICE
                </th>
                <th scope="col" className="px-6 py-4">
                  STOCK STATUS
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((product) => {
                // Determine stock status dynamically or fallback to in stock
                const isOutOfStock =
                  "inStock" in product ? !product.inStock : false;

                return (
                  <tr key={product.id} className="group">
                    {/* Product Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/product/${product.id}`}
                          className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-50"
                        >
                          <SmartImage
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </Link>
                        <Link
                          href={`/product/${product.id}`}
                          className="font-medium text-neutral-800 hover:text-emerald-600 transition-colors"
                        >
                          {product.title}
                        </Link>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-neutral-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <del className="text-xs text-neutral-400">
                            {formatPrice(product.originalPrice)}
                          </del>
                        )}
                      </div>
                    </td>

                    {/* Stock Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isOutOfStock ? (
                        <span className="inline-block rounded bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="inline-block rounded bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => addToCart(product.id)}
                          className={`rounded-full px-5 py-2.5 text-xs font-semibold text-white transition-colors ${
                            isOutOfStock
                              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                              : "bg-emerald-600 hover:bg-emerald-700"
                          }`}
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          aria-label="Remove from wishlist"
                          onClick={() => toggleWishlist(product.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-neutral-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
