import type { Metadata } from "next";
import ShopPage from "@/components/shop/ShopPage";
import { allProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop All | tobarok",
  description:
    "Browse the full tobarok collection — t-shirts, polos, hoodies, sweatpants and accessories.",
};

export default function Shop() {
  return (
    <ShopPage
      title="Shop All"
      description="Every piece from the tobarok family — t-shirts, polos, hoodies, bottoms and accessories."
      products={allProducts}
    />
  );
}
