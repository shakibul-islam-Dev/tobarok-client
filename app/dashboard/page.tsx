import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import UserDashboard from "./UserDashboard";

export const metadata: Metadata = {
  title: "Dashboard | tobarok",
  description: "Your tobarok account dashboard.",
};

export default function Dashboard() {
  return (
    <AuthRequired>
      <UserDashboard />
    </AuthRequired>
  );
}
