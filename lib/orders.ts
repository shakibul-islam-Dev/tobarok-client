/**
 * Order domain helpers.
 *
 * Kept separate from the transaction ledger so that order identity (used as
 * the `reference` in wallet transactions) stays a single, stable concept.
 */

/** Short human-friendly order id, e.g. "#7384K2". */
export function createOrderId(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `#${timestamp}${random}`;
}

/** Strips the leading "#" so ids can be used in URL paths, e.g. "7384K2". */
export function stripOrderHash(orderId: string): string {
  return orderId.replace(/^#/, "");
}
