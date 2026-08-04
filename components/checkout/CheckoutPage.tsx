"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, ShieldCheck } from "lucide-react";
import { allProducts, CURRENCY } from "@/lib/data";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useStore } from "@/components/store/StoreProvider";
import { useWalletLedger } from "@/lib/use-ledger";
import {
  createIdempotencyKey,
  formatMoney,
  TransactionError,
} from "@/lib/transactions";
import { createOrderId, stripOrderHash } from "@/lib/orders";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;
const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

const productById = new Map(allProducts.map((p) => [p.id, p]));

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartCount, clearCart } = useStore();
  const { balance: walletBalance, addTransaction } = useWalletLedger();
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [payment, setPayment] = useState<"cod" | "bkash" | "wallet">("cod");
  const [payError, setPayError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const delivery = cartSubtotal === 0 || cartSubtotal >= 1500 ? 0 : 90;
  const total = cartSubtotal + delivery;

  /**
   * Places the order. For wallet payments this first commits a DEBIT to the
   * shared transaction ledger; any validation failure (insufficient balance,
   * duplicate application) aborts the order before anything is confirmed, so
   * an order can never be placed without the money actually moving.
   */
  const handlePlaceOrder = () => {
    if (submitting) return;
    setPayError(null);

    // Create the order id FIRST so the wallet transaction and the confirmation
    // screen both link to the exact same order reference.
    const orderId = createOrderId();

    if (payment === "wallet") {
      setSubmitting(true);
      try {
        addTransaction({
          type: "debit",
          source: "order_payment",
          amount: total,
          reference: orderId,
          idempotencyKey: createIdempotencyKey({
            source: "order_payment",
            amount: total,
            reference: orderId,
            nonce: "checkout",
          }),
        });
      } catch (err) {
        setPayError(
          err instanceof TransactionError
            ? err.message
            : "Could not charge your wallet. Please try again."
        );
        setSubmitting(false);
        return;
      }
    }

    clearCart();
    setPlacedOrderId(orderId);
    setSubmitting(false);
  };

  if (placedOrderId) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
            <Check size={28} />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
            Order {placedOrderId} placed!
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Thanks for shopping with tobarok.{" "}
            {payment === "wallet"
              ? `${formatMoney(total)} was charged to your wallet.`
              : "We'll confirm your order shortly."}{" "}
            Track your order from the Track Order page.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href={`/track?order=${stripOrderHash(placedOrderId)}`}
              className="rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
            >
              Track Order
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:border-neutral-900"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900">
          Your cart is empty
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-neutral-900 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb
        items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        Checkout
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePlaceOrder();
          }}
          className="space-y-5 lg:col-span-2"
        >
          <fieldset className="rounded-2xl border border-neutral-200 p-6">
            <legend className="px-2 text-sm font-bold uppercase tracking-widest text-neutral-900">
              Contact
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Full name" className={inputCls} />
              <input
                required
                type="tel"
                placeholder="Phone number"
                className={inputCls}
              />
            </div>
            <input
              required
              type="email"
              placeholder="Email address"
              className={`${inputCls} mt-4`}
            />
          </fieldset>

          <fieldset className="rounded-2xl border border-neutral-200 p-6">
            <legend className="px-2 text-sm font-bold uppercase tracking-widest text-neutral-900">
              Delivery Address
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Address / area"
                className={`${inputCls} sm:col-span-2`}
              />
              <input required placeholder="District" className={inputCls} />
              <input required placeholder="Post code" className={inputCls} />
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-neutral-200 p-6">
            <legend className="px-2 text-sm font-bold uppercase tracking-widest text-neutral-900">
              Payment Method
            </legend>
            <div className="space-y-3">
              {(
                [
                  { id: "cod", label: "Cash on Delivery" },
                  { id: "bkash", label: "bKash / Nagad / Rocket" },
                  {
                    id: "wallet",
                    label: `Wallet balance (${formatMoney(walletBalance)})`,
                  },
                ] as const
              ).map((method) => (
                <label
                  key={method.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 p-4 transition-colors has-[:checked]:border-neutral-900"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={payment === method.id}
                    onChange={() => {
                      setPayment(method.id);
                      setPayError(null);
                    }}
                    className="accent-neutral-900"
                  />
                  <span className="text-sm font-medium text-neutral-900">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
            {payment === "bkash" && (
              <p className="mt-3 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500">
                You&apos;ll receive the bKash/Nagad payment number after placing
                the order.
              </p>
            )}
            {payment === "wallet" && (
              <p
                className={`mt-3 rounded-lg p-3 text-xs ${
                  walletBalance < total
                    ? "bg-red-50 text-red-600"
                    : "bg-neutral-50 text-neutral-500"
                }`}
              >
                {walletBalance < total
                  ? `Insufficient balance — ${formatMoney(
                      total - walletBalance
                    )} short for this order.`
                  : `Your wallet will be charged ${formatMoney(total)} for this order.`}
              </p>
            )}
            {payError && (
              <p className="mt-3 flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle size={16} />
                {payError}
              </p>
            )}
          </fieldset>
        </form>

        <div className="h-fit rounded-2xl bg-neutral-50 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
            Your Order
          </h2>
          <ul className="mt-4 space-y-3">
            {cart.map((item) => {
              const product = productById.get(item.id);
              if (!product) return null;
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="line-clamp-1 text-neutral-600">
                    {product.title} × {item.qty}
                  </span>
                  <span className="shrink-0 font-medium text-neutral-900">
                    {formatPrice(product.price * item.qty)}
                  </span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-neutral-200 pt-4 text-sm">
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
          <p className="mt-4 flex items-start gap-2 text-xs text-neutral-500">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
            {cartCount} {cartCount === 1 ? "item" : "items"} • secure
            checkout
          </p>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="mt-5 w-full rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Processing…"
              : payment === "wallet"
                ? `Place Order · Pay ${formatMoney(total)}`
                : `Place Order · ${formatMoney(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
