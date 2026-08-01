import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import AdminOrdersPage from "@/components/pages/AdminOrdersPage";

export const metadata: Metadata = {
  title: "Sales & Orders | tobarok Admin",
  description: "Track tobarok sales and orders.",
};

export default function AdminOrders() {
  return (
    <AuthRequired allowedRoles={["admin", "superadmin"]}>
      <AdminOrdersPage />
    </AuthRequired>
  );
}
