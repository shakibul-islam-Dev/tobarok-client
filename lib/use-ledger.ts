"use client";

import { useSyncExternalStore } from "react";
import {
  applyTransaction,
  getBalance,
  loadLedger,
  saveLedger,
  type CreateTransactionInput,
  type WalletTransaction,
} from "./transactions";

/**
 * useWalletLedger
 * ---------------
 * React hook that keeps the wallet ledger in sync with localStorage and
 * re-renders every subscriber whenever the ledger changes — either in this tab
 * or in another tab (via the browser `storage` event).
 *
 * It uses `useSyncExternalStore`, which is the idiomatic way to read external
 * mutable state (localStorage) during render:
 *   - `getServerSnapshot` gives a safe empty snapshot for SSR/hydration,
 *   - `getSnapshot` returns the real ledger on the client,
 *   - `subscribe` wires React to change notifications.
 *
 * All writes go through `addTransaction`, which commits to the shared module
 * cache, persists to localStorage, and notifies every subscriber.
 */

/** Must match the storage key used in `lib/transactions.ts`. */
const STORAGE_KEY = "tobarok-wallet-ledger-v1";

interface LedgerState {
  ledger: WalletTransaction[];
  restored: boolean;
}

/** Module-level cache so `getSnapshot` returns a stable reference. */
let cache: LedgerState | null = null;
const listeners = new Set<() => void>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

/** Re-read from storage; the empty-state is what SSR should render. */
function readFromStorage(): LedgerState {
  if (typeof window === "undefined") {
    return { ledger: [], restored: false };
  }
  return loadLedger(window.localStorage);
}

function getSnapshot(): LedgerState {
  if (cache === null) {
    cache = readFromStorage();
  }
  return cache;
}

/** Safe snapshot for server rendering / first hydration render. */
function getServerSnapshot(): LedgerState {
  return { ledger: [], restored: false };
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);

  // Keep multiple tabs in sync — re-read storage when another tab writes.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      emitChange();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Applies a transaction to the shared ledger, persists it and notifies all
 * subscribers. Throws `TransactionError` for invalid/duplicate/insufficient
 * operations (see `applyTransaction`).
 */
function commit(input: CreateTransactionInput): {
  transaction: WalletTransaction;
  saved: boolean;
} {
  const current = getSnapshot();
  const result = applyTransaction(current.ledger, input);
  cache = { ledger: result.ledger, restored: false };
  const saved =
    typeof window !== "undefined" && saveLedger(window.localStorage, cache.ledger);
  emitChange();
  return { transaction: result.transaction, saved };
}

export function useWalletLedger() {
  const { ledger, restored } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return {
    ledger,
    balance: getBalance(ledger),
    restored,
    addTransaction: commit,
  };
}
