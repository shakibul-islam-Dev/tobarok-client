import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import AdminPage from "@/components/pages/AdminPage";

export const metadata: Metadata = {
  title: "Admin Panel | tobarok",
  description: "tobarok admin dashboard.",
};

export default function Admin() {
  return (
    <AuthRequired allowedRoles={["admin", "superadmin"]}>
      <AdminPage />
    </AuthRequired>
  );
}
