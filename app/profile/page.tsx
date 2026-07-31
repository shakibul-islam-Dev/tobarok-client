import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import ProfilePage from "@/components/pages/ProfilePage";

export const metadata: Metadata = {
  title: "Profile Update | tobarok",
  description: "Update your tobarok profile information.",
};

export default function Profile() {
  return (
    <AuthRequired>
      <ProfilePage />
    </AuthRequired>
  );
}
