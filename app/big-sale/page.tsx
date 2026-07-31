import ShopPage from "@/components/shop/ShopPage";
import { featuredPages } from "@/lib/data";

export default function BigSale() {
  return (
    <ShopPage
      title={featuredPages["big-sale"].title}
      description={featuredPages["big-sale"].description}
      products={featuredPages["big-sale"].products}
      crumbs={[{ label: "Big Sale" }]}
    />
  );
}
