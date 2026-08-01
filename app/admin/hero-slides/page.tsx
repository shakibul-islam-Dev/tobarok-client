import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import AdminHeroSlidesPage from "@/components/pages/AdminHeroSlidesPage";

export const metadata: Metadata = {
  title: "Hero Slides | tobarok Admin",
  description: "Manage tobarok homepage hero slides.",
};

export default function AdminHeroSlides() {
  return (
    <AuthRequired allowedRoles={["admin", "superadmin"]}>
      <AdminHeroSlidesPage />
    </AuthRequired>
  );
}
