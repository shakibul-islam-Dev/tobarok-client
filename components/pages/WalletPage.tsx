"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Link2,
  Plus,
  Wallet,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useWalletLedger } from "@/lib/use-ledger";
import {
  createIdempotencyKey,
  formatMoney,
  linkReferences,
  signedAmount,
  SOURCE_LABEL,
  TransactionError,
  type CreateTransactionInput,
} from "@/lib/transactions";
import { initialOrders } from "@/lib/admin-data";
import { stripOrderHash } from "@/lib/orders";

export default function WalletPage() {
  const { ledger, balance, restored, addTransaction } = useWalletLedger();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [persistWarning, setPersistWarning] = useState<string | null>(null);

  // Dynamic linking: transaction.reference -> matching order (if any).
  const orderLinks = linkReferences(ledger, initialOrders);
  // Newest first for display.
  const history = [...ledger].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  const handleTopUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    // Guard against double submission (double clicks, retries): each submit
    // gets a fresh nonce, and the idempotency key rejects re-applying it.
    setSubmitting(true);
    try {
      const input: CreateTransactionInput = {
        type: "credit",
        source: "topup",
        amount: value,
        idempotencyKey: createIdempotencyKey({
          source: "topup",
          amount: value,
          nonce: crypto.randomUUID(),
        }),
      };
      const result = addTransaction(input);
      if (!result.saved) {
        setPersistWarning(
          "Could not save to this device — your balance may reset."
        );
      }
      setAmount("");
      setSuccess(`Added ${formatMoney(value)} to your wallet.`);
    } catch (err) {
      setError(
        err instanceof TransactionError
          ? err.message
          : "Something went wrong while adding funds. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Wallet" }]} />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        Wallet
      </h1>

      {restored && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertTriangle size={16} />
          Saved transaction history could not be read and was reset to a
          starting balance.
        </div>
      )}
      {persistWarning && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertTriangle size={16} />
          {persistWarning}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-neutral-900 p-6 text-white shadow-sm">
            <div className="flex items-center gap-2 text-neutral-400">
              <Wallet size={18} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Current Balance
              </span>
            </div>
            <p className="mt-3 text-4xl font-extrabold tracking-tight">
              {formatMoney(balance)}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Cashback and refunds are credited here.
            </p>
          </div>

          <form
            onSubmit={handleTopUp}
            className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm"
          >
            <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900">
              <Plus size={18} className="text-neutral-400" />
              Add Money
            </h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                disabled={submitting}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                  setSuccess(null);
                }}
                placeholder="Amount (e.g. 50)"
                className="w-full flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Adding…" : "Add Funds"}
              </button>
            </div>
            {error && (
              <p className="mt-3 flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle size={16} />
                {error}
              </p>
            )}
            {success && (
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                <Check size={16} />
                {success}
              </p>
            )}
          </form>

          <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
            <div className="px-6 py-5">
              <h2 className="text-base font-bold text-neutral-900">
                Transaction History
              </h2>
            </div>
            {history.length === 0 ? (
              <p className="px-6 pb-8 text-sm text-neutral-400">
                No transactions yet. Add money to get started.
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {history.map((tx) => {
                  const order = orderLinks.get(tx.id);
                  return (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          {tx.description}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                          {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            {SOURCE_LABEL[tx.source]}
                          </span>
                          {order && (
                            <Link
                              href={`/orders/${stripOrderHash(order.id)}`}
                              className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600 transition-colors hover:bg-neutral-200"
                            >
                              <Link2 size={10} />
                              {order.id}
                            </Link>
                          )}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-sm font-bold ${
                          tx.type === "credit"
                            ? "text-emerald-600"
                            : "text-neutral-900"
                        }`}
                      >
                        {signedAmount(tx)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="h-fit rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            How it works
          </span>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600">
            <li>Earn cashback on every order.</li>
            <li>Refunds are returned straight to your wallet.</li>
            <li>Use your balance at checkout to pay for orders.</li>
            <li>Balance never expires.</li>
          </ul>
          <p className="mt-5 rounded-lg bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-500">
            Every movement is recorded in a transaction ledger — your balance is
            always the sum of your history, so it can&apos;t drift out of sync.
          </p>
        </div>
      </div>
    </div>
  );
}
