import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import AdminCategoriesPage from "@/components/pages/AdminCategoriesPage";

export const metadata: Metadata = {
  title: "Categories | tobarok Admin",
  description: "Manage tobarok product categories.",
};

export default function AdminCategories() {
  return (
    <AuthRequired allowedRoles={["admin", "superadmin"]}>
      <AdminCategoriesPage />
    </AuthRequired>
  );
}
