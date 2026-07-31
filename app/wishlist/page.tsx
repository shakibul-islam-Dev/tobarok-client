import type { Metadata } from "next";
import WishlistPage from "@/components/wishlist/WishlistPage";

export const metadata: Metadata = {
  title: "Wishlist | tobarok",
  description: "Your saved tobarok products, waiting for you.",
};

export default function Wishlist() {
  return <WishlistPage />;
}
