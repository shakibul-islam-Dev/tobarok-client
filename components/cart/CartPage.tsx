"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { allProducts, CURRENCY } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useStore } from "@/components/store/StoreProvider";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

const productById = new Map(allProducts.map((p) => [p.id, p]));

export default function CartPage() {
  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartCount,
  } = useStore();

  const delivery = cartSubtotal === 0 || cartSubtotal >= 1500 ? 0 : 90;
  const total = cartSubtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-16">
        <Breadcrumb items={[{ label: "Cart" }]} />
        <div className="flex flex-col items-center py-16 text-center">
          <ShoppingBag size={48} className="text-neutral-300" />
          <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-neutral-900">
            Your cart is empty
          </h1>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            Looks like you haven&apos;t added anything yet. Explore the collection
            and find your next favourite fit.
          </p>
          <Link
            href="/shop"
            className="mt-6 rounded-full bg-neutral-900 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        Shopping Cart
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => {
            const product = productById.get(item.id);
            if (!product) return null;
            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-neutral-200 p-3 sm:p-4"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-28 sm:w-28"
                >
                  <SmartImage
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/product/${product.id}`}
                      className="line-clamp-2 text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-500"
                    >
                      {product.title}
                    </Link>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-neutral-400 transition-colors hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {formatPrice(product.price)} each
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-lg border border-neutral-200">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="flex h-8 w-8 items-center justify-center text-neutral-700 hover:text-black"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center text-neutral-700 hover:text-black"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">
                      {formatPrice(product.price * item.qty)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-neutral-400 underline-offset-4 hover:text-red-600 hover:underline"
          >
            Clear cart
          </button>
        </div>

        <div className="h-fit rounded-2xl bg-neutral-50 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
            Order Summary
          </h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Subtotal</dt>
              <dd className="font-medium text-neutral-900">
                {formatPrice(cartSubtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Delivery</dt>
              <dd className="font-medium text-neutral-900">
                {delivery === 0 ? "Free" : formatPrice(delivery)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-3 text-base">
              <dt className="font-bold text-neutral-900">Total</dt>
              <dd className="font-bold text-neutral-900">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
          {delivery > 0 && (
            <p className="mt-3 rounded-lg bg-neutral-100 p-3 text-xs text-neutral-500">
              Add {formatPrice(1500 - cartSubtotal)} more to get free delivery.
            </p>
          )}
          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
          >
            Proceed to Checkout
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-xs font-medium text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
