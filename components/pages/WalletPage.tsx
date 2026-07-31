"use client";

import { useState } from "react";
import { Check, Plus, Wallet } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const BALANCE_KEY = "tobarok-wallet-balance";

const transactions = [
  {
    id: 1,
    label: "Order #738 — payment",
    amount: "-$135.00",
    date: "8 Sep, 2020",
    type: "debit" as const,
  },
  {
    id: 2,
    label: "Cashback from Order #701",
    amount: "+$3.25",
    date: "24 May, 2020",
    type: "credit" as const,
  },
  {
    id: 3,
    label: "Wallet top-up",
    amount: "+$100.00",
    date: "12 May, 2020",
    type: "credit" as const,
  },
  {
    id: 4,
    label: "Order #130 — payment",
    amount: "-$250.00",
    date: "22 Oct, 2020",
    type: "debit" as const,
  },
];

function loadBalance(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(BALANCE_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(() => loadBalance());
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }
    const next = balance + value;
    setBalance(next);
    window.localStorage.setItem(BALANCE_KEY, String(next));
    setAmount("");
    setMessage(`Added $${value.toFixed(2)} to your wallet`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Wallet" }]} />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        Wallet
      </h1>

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
              ${balance.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Cashback and refunds are credited here.
            </p>
          </div>

          <form
            onSubmit={handleAdd}
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
                onChange={(e) => {
                  setAmount(e.target.value);
                  setMessage(null);
                }}
                placeholder="Amount (e.g. 50)"
                className="w-full flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
              >
                Add Funds
              </button>
            </div>
            {message && (
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                <Check size={16} />
                {message}
              </p>
            )}
          </form>

          <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
            <div className="px-6 py-5">
              <h2 className="text-base font-bold text-neutral-900">
                Transaction History
              </h2>
            </div>
            <ul className="divide-y divide-neutral-100">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {tx.label}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">{tx.date}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      tx.type === "credit"
                        ? "text-emerald-600"
                        : "text-neutral-900"
                    }`}
                  >
                    {tx.amount}
                  </span>
                </li>
              ))}
            </ul>
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
        </div>
      </div>
    </div>
  );
}
