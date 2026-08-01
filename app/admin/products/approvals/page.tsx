import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import AdminApprovalsPage from "@/components/pages/AdminApprovalsPage";

export const metadata: Metadata = {
  title: "Product Approvals | tobarok Admin",
  description: "Approve or reject new tobarok products.",
};

export default function AdminApprovals() {
  return (
    <AuthRequired allowedRoles={["admin", "superadmin"]}>
      <AdminApprovalsPage />
    </AuthRequired>
  );
}
