import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import OrdersPage from "@/components/pages/OrdersPage";

export const metadata: Metadata = {
  title: "Order History | tobarok",
  description: "Review and track your tobarok orders.",
};

export default function Orders() {
  return (
    <AuthRequired>
      <OrdersPage />
    </AuthRequired>
  );
}
