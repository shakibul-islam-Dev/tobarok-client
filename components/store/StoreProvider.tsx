"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { allProducts } from "@/lib/data";

interface CartItem {
  id: number;
  qty: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: number[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (id: number, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
}

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = "tobarok.cart";
const WISHLIST_KEY = "tobarok.wishlist";

const EMPTY_CART: CartItem[] = [];
const EMPTY_WISHLIST: number[] = [];

type Listener = () => void;

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

let cartState: CartItem[] = EMPTY_CART;
let wishlistState: number[] = EMPTY_WISHLIST;
let loaded = false;
const cartListeners = new Set<Listener>();
const wishlistListeners = new Set<Listener>();

const productPrice = new Map(
  allProducts.map((p) => [p.id, p.price] as const)
);

function sanitizeCart(items: CartItem[]): CartItem[] {
  return items.filter(
    (i) =>
      typeof i.id === "number" &&
      Number.isInteger(i.id) &&
      productPrice.has(i.id)
  );
}

function sanitizeWishlist(ids: number[]): number[] {
  return ids.filter(
    (id) => typeof id === "number" && Number.isInteger(id) && productPrice.has(id)
  );
}

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  cartState = sanitizeCart(load(CART_KEY, EMPTY_CART));
  wishlistState = sanitizeWishlist(load(WISHLIST_KEY, EMPTY_WISHLIST));
  window.localStorage.setItem(CART_KEY, JSON.stringify(cartState));
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistState));
}

function subscribeCart(listener: Listener) {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function subscribeWishlist(listener: Listener) {
  wishlistListeners.add(listener);
  return () => wishlistListeners.delete(listener);
}

function getCartSnapshot(): CartItem[] {
  ensureLoaded();
  return cartState;
}

function getWishlistSnapshot(): number[] {
  ensureLoaded();
  return wishlistState;
}

function updateCart(updater: (prev: CartItem[]) => CartItem[]) {
  ensureLoaded();
  cartState = updater(cartState);
  window.localStorage.setItem(CART_KEY, JSON.stringify(cartState));
  cartListeners.forEach((l) => l());
}

function updateWishlist(updater: (prev: number[]) => number[]) {
  ensureLoaded();
  wishlistState = updater(wishlistState);
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistState));
  wishlistListeners.forEach((l) => l());
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    () => EMPTY_CART
  );
  const wishlist = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    () => EMPTY_WISHLIST
  );

  const addToCart = useCallback((id: number, qty = 1) => {
    updateCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i
        );
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    updateCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    updateCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 99) } : i))
    );
  }, []);

  const clearCart = useCallback(() => updateCart(() => []), []);

  const toggleWishlist = useCallback((id: number) => {
    updateWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }, []);

  const isWishlisted = useCallback(
    (id: number) => wishlist.includes(id),
    [wishlist]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, i) => sum + (productPrice.get(i.id) ?? 0) * i.qty, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      toggleWishlist,
      isWishlisted,
    }),
    [
      cart,
      wishlist,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      toggleWishlist,
      isWishlisted,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
