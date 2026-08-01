import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import AdminProductsPage from "@/components/pages/AdminProductsPage";

export const metadata: Metadata = {
  title: "Products | tobarok Admin",
  description: "Manage the tobarok product catalog.",
};

export default function AdminProducts() {
  return (
    <AuthRequired allowedRoles={["admin", "superadmin"]}>
      <AdminProductsPage />
    </AuthRequired>
  );
}
