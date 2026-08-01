import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import AdminOutletsPage from "@/components/pages/AdminOutletsPage";

export const metadata: Metadata = {
  title: "Outlets | tobarok Admin",
  description: "Manage tobarok physical store outlets.",
};

export default function AdminOutlets() {
  return (
    <AuthRequired allowedRoles={["admin", "superadmin"]}>
      <AdminOutletsPage />
    </AuthRequired>
  );
}
