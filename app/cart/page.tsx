import type { Metadata } from "next";
import CartPage from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Cart | tobarok",
  description: "Review the items in your tobarok shopping cart.",
};

export default function Cart() {
  return <CartPage />;
}
