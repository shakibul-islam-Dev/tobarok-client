import ShopPage from "@/components/shop/ShopPage";
import { featuredPages } from "@/lib/data";

export default function NewIn() {
  return (
    <ShopPage
      title={featuredPages.new.title}
      description={featuredPages.new.description}
      products={featuredPages.new.products}
      crumbs={[{ label: "New In" }]}
    />
  );
}
