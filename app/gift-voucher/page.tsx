import ShopPage from "@/components/shop/ShopPage";
import { bestDeal } from "@/lib/data";

export default function GiftVoucher() {
  return (
    <ShopPage
      title="Gift Vouchers"
      description="The perfect present — let them pick their own perfect fit."
      products={bestDeal}
      crumbs={[{ label: "Gift Vouchers" }]}
    />
  );
}
