import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import Dashboard from "./Dashboard";

export const metadata: Metadata = {
  title: "Dashboard | tobarok",
  description: "Your tobarok account dashboard.",
};

export default function DashboardPage() {
  return (
    <AuthRequired>
      <Dashboard />
    </AuthRequired>
  );
}
