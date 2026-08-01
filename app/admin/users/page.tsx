import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import AdminUsersPage from "@/components/pages/AdminUsersPage";

export const metadata: Metadata = {
  title: "User Management | tobarok",
  description: "Manage tobarok users and roles. Super admin only.",
};

export default function AdminUsers() {
  return (
    <AuthRequired allowedRoles={["superadmin"]}>
      <AdminUsersPage />
    </AuthRequired>
  );
}
