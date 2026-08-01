/**
 * Wallet transaction ledger.
 *
 * This module is the single source of truth for every wallet money movement.
 * The key design rule is that the balance is NEVER stored on its own — it is
 * always derived from the ledger via `getBalance()`. Because the balance is
 * computed from the exact same list of transactions shown to the user, the
 * two can never drift out of sync.
 *
 * The ledger is append-only and every transaction carries:
 *   - a `reference`  -> dynamic link to a related entity (e.g. an order id),
 *   - an `idempotencyKey` -> a unique key per *logical* operation, which lets
 *     us reject accidental duplicate applications (double clicks, retries).
 *
 * All mutations go through `applyTransaction()`, which enforces:
 *   1. input validation (amount, source, type),
 *   2. idempotency (no duplicate logical operations),
 *   3. funds guarantee (a debit can never take the balance below zero).
 *
 * Storage access is wrapped in try/catch so a corrupt or unavailable
 * localStorage (private mode, quota, hand-edited data) degrades to a safe
 * seed ledger instead of crashing the page.
 */

import { CURRENCY } from "./data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Direction of the money movement. */
export type TransactionType = "credit" | "debit";

/** Business reason the transaction happened. */
export type TransactionSource =
  | "topup"
  | "order_payment"
  | "cashback"
  | "refund"
  | "adjustment";

export const TRANSACTION_SOURCES: readonly TransactionSource[] = [
  "topup",
  "order_payment",
  "cashback",
  "refund",
  "adjustment",
];

export const SOURCE_LABEL: Record<TransactionSource, string> = {
  topup: "Top-up",
  order_payment: "Order Payment",
  cashback: "Cashback",
  refund: "Refund",
  adjustment: "Adjustment",
};

/** A single ledger entry. Immutable after creation. */
export interface WalletTransaction {
  id: string;
  type: TransactionType;
  source: TransactionSource;
  /** Always positive; direction is expressed by `type`. */
  amount: number;
  /** Optional dynamic link to a related entity, e.g. an order id "#738". */
  reference?: string;
  description: string;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** Unique per logical operation; guards against duplicate application. */
  idempotencyKey: string;
}

/** Input shape accepted by `createTransaction` / `applyTransaction`. */
export interface CreateTransactionInput {
  type: TransactionType;
  source: TransactionSource;
  amount: number;
  reference?: string;
  description?: string;
  idempotencyKey?: string;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export type TransactionErrorCode =
  | "INVALID_AMOUNT"
  | "DUPLICATE_TRANSACTION"
  | "INSUFFICIENT_FUNDS";

/** Typed error so callers can branch on `code` or just show `message`. */
export class TransactionError extends Error {
  readonly code: TransactionErrorCode;

  constructor(code: TransactionErrorCode, message: string) {
    super(message);
    this.name = "TransactionError";
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Amounts must be finite, positive numbers (e.g. 0 or NaN are rejected). */
export function isValidAmount(amount: unknown): amount is number {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}

function assertValidInput(input: CreateTransactionInput): void {
  if (!isValidAmount(input.amount)) {
    throw new TransactionError(
      "INVALID_AMOUNT",
      "Amount must be a positive number."
    );
  }
  if (!TRANSACTION_SOURCES.includes(input.source)) {
    throw new TransactionError(
      "INVALID_AMOUNT",
      `Unknown transaction source: "${input.source}".`
    );
  }
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

/** Collision-safe-ish id. Fine for a client-only demo ledger. */
export function createId(nonce?: string): string {
  const salt = nonce ?? Math.random().toString(36).slice(2, 10);
  return `tx_${Date.now().toString(36)}_${salt}`;
}

/**
 * Builds the idempotency key for a logical operation.
 * Re-applying the same operation (same source/amount/reference + nonce) will
 * be rejected by `applyTransaction` as a duplicate.
 */
export function createIdempotencyKey(input: {
  source: TransactionSource;
  amount: number;
  reference?: string;
  nonce?: string | number;
}): string {
  const nonce = String(input.nonce ?? Date.now());
  return [input.source, input.amount, input.reference ?? "-", nonce].join("|");
}

function defaultDescription(input: CreateTransactionInput): string {
  switch (input.source) {
    case "topup":
      return "Wallet top-up";
    case "order_payment":
      return input.reference
        ? `Payment for order ${input.reference}`
        : "Order payment";
    case "cashback":
      return input.reference
        ? `Cashback from order ${input.reference}`
        : "Cashback";
    case "refund":
      return input.reference
        ? `Refund for order ${input.reference}`
        : "Refund";
    default:
      return "Balance adjustment";
  }
}

/** Builds a validated, stamped transaction. */
export function createTransaction(
  input: CreateTransactionInput
): WalletTransaction {
  assertValidInput(input);
  return {
    id: createId(),
    type: input.type,
    source: input.source,
    amount: input.amount,
    reference: input.reference,
    description: input.description ?? defaultDescription(input),
    createdAt: new Date().toISOString(),
    idempotencyKey: input.idempotencyKey ?? createIdempotencyKey(input),
  };
}

// ---------------------------------------------------------------------------
// Ledger operations (pure)
// ---------------------------------------------------------------------------

/**
 * Balance is DERIVED from the ledger. This is the invariant that keeps the
 * displayed balance identical to the history shown to the user.
 */
export function getBalance(ledger: WalletTransaction[]): number {
  return ledger.reduce(
    (sum, tx) => sum + (tx.type === "credit" ? tx.amount : -tx.amount),
    0
  );
}

/** True if a logical operation was already applied to the ledger. */
export function isDuplicate(
  ledger: WalletTransaction[],
  idempotencyKey: string
): boolean {
  return ledger.some((tx) => tx.idempotencyKey === idempotencyKey);
}

/**
 * The only way to mutate the ledger. Returns a NEW array (pure) plus the
 * created transaction. Throws `TransactionError` on any invalid state so the
 * caller never ends up with a corrupt ledger.
 */
export function applyTransaction(
  ledger: WalletTransaction[],
  input: CreateTransactionInput
): { ledger: WalletTransaction[]; transaction: WalletTransaction } {
  const transaction = createTransaction(input);

  // 1. Idempotency guard — the same logical operation must never land twice.
  if (isDuplicate(ledger, transaction.idempotencyKey)) {
    throw new TransactionError(
      "DUPLICATE_TRANSACTION",
      "This transaction was already applied."
    );
  }

  // 2. Funds guard — debits are checked against the CURRENT derived balance.
  if (transaction.type === "debit" && getBalance(ledger) < transaction.amount) {
    throw new TransactionError(
      "INSUFFICIENT_FUNDS",
      "Insufficient wallet balance for this payment."
    );
  }

  return { ledger: [...ledger, transaction], transaction };
}

// ---------------------------------------------------------------------------
// Dynamic reference linking
// ---------------------------------------------------------------------------

/**
 * Links every transaction to its related entity through the `reference` field.
 *
 * The caller supplies the entity registry (e.g. orders); this returns a map
 * of transaction id -> matched entity. Transactions whose reference matches
 * nothing are simply omitted, so stale links never break the UI.
 */
export function linkReferences<TEntity extends { id: string }>(
  ledger: WalletTransaction[],
  entities: TEntity[]
): Map<string, TEntity> {
  const registry = new Map<string, TEntity>(
    entities.map((entity) => [String(entity.id), entity])
  );

  const links = new Map<string, TEntity>();
  for (const tx of ledger) {
    if (!tx.reference) continue;
    // Normalize "#738" -> "738" so ids match whether or not they carry "#".
    const normalized = tx.reference.replace(/^#/, "");
    const entity = registry.get(normalized) ?? registry.get(tx.reference);
    if (entity) links.set(tx.id, entity);
  }
  return links;
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatMoney(amount: number): string {
  return `${CURRENCY}${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Signed display for a transaction, e.g. "+৳100.00" / "-৳135.00". */
export function signedAmount(tx: WalletTransaction): string {
  return tx.type === "credit"
    ? `+${formatMoney(tx.amount)}`
    : `-${formatMoney(tx.amount)}`;
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

/** Versioned key so we can migrate/ignore data from older shapes. */
const STORAGE_KEY = "tobarok-wallet-ledger-v1";

interface StoredShape {
  version: 1;
  transactions: WalletTransaction[];
}

/** Runtime schema check for data read out of localStorage. */
function isStoredShape(value: unknown): value is StoredShape {
  if (typeof value !== "object" || value === null) return false;
  const stored = value as Partial<StoredShape>;
  return (
    stored.version === 1 &&
    Array.isArray(stored.transactions) &&
    stored.transactions.every(isWalletTransaction)
  );
}

function isWalletTransaction(value: unknown): value is WalletTransaction {
  if (typeof value !== "object" || value === null) return false;
  const tx = value as Partial<WalletTransaction>;
  return (
    typeof tx.id === "string" &&
    (tx.type === "credit" || tx.type === "debit") &&
    TRANSACTION_SOURCES.includes(tx.source as TransactionSource) &&
    isValidAmount(tx.amount) &&
    typeof tx.description === "string" &&
    typeof tx.createdAt === "string" &&
    typeof tx.idempotencyKey === "string"
  );
}

/**
 * Safe load. Returns `restored: true` when stored data was missing, corrupt or
 * unavailable — the caller can use that flag to notify the user that their
 * previous history could not be read.
 */
export function loadLedger(
  storage: Storage | undefined
): { ledger: WalletTransaction[]; restored: boolean } {
  if (!storage) return { ledger: seedLedger(), restored: false };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { ledger: seedLedger(), restored: false };

    const parsed: unknown = JSON.parse(raw);
    if (!isStoredShape(parsed)) {
      // Corrupt/hand-edited data: reset to a known-good seed.
      return { ledger: seedLedger(), restored: true };
    }
    return { ledger: parsed.transactions, restored: false };
  } catch {
    // localStorage can throw in private mode / under quota. Never crash.
    return { ledger: seedLedger(), restored: true };
  }
}

/** Safe save. Returns false if persistence failed (caller may surface a warning). */
export function saveLedger(
  storage: Storage | undefined,
  ledger: WalletTransaction[]
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, transactions: ledger }));
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

/**
 * A small, internally consistent starting ledger. Ordering matters: debits are
 * only valid when the running balance is sufficient, so credits come first.
 */
export function seedLedger(): WalletTransaction[] {
  const now = Date.now();
  const DAY = 86_400_000;

  const seeds: Array<[CreateTransactionInput, number]> = [
    [
      {
        type: "credit",
        source: "topup",
        amount: 500,
        description: "Wallet top-up",
        idempotencyKey: "seed:topup:500",
      },
      6,
    ],
    [
      {
        type: "debit",
        source: "order_payment",
        amount: 135,
        reference: "#738",
        idempotencyKey: "seed:order_payment:135:#738",
      },
      5,
    ],
    [
      {
        type: "credit",
        source: "cashback",
        amount: 3.25,
        reference: "#701",
        idempotencyKey: "seed:cashback:3.25:#701",
      },
      4,
    ],
    [
      {
        type: "credit",
        source: "topup",
        amount: 100,
        description: "Wallet top-up",
        idempotencyKey: "seed:topup:100",
      },
      2,
    ],
    [
      {
        type: "debit",
        source: "order_payment",
        amount: 250,
        reference: "#130",
        idempotencyKey: "seed:order_payment:250:#130",
      },
      1,
    ],
  ];

  return seeds.map(([input, dayOffset]) => ({
    ...createTransaction(input),
    // Backdate so history reads naturally instead of all being "now".
    createdAt: new Date(now - dayOffset * DAY).toISOString(),
  }));
}
