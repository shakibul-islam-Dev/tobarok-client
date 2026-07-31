import ShopPage from "@/components/shop/ShopPage";
import { featuredPages } from "@/lib/data";

export default function MostWanted() {
  return (
    <ShopPage
      title={featuredPages["most-wanted"].title}
      description={featuredPages["most-wanted"].description}
      products={featuredPages["most-wanted"].products}
      crumbs={[{ label: "Most Wanted" }]}
    />
  );
}
