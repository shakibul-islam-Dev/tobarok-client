import type { Metadata } from "next";
import AccountPage from "@/components/pages/AccountPage";

export const metadata: Metadata = {
  title: "My Account | tobarok",
  description: "Login or create your tobarok account.",
};

export default function Account() {
  return <AccountPage />;
}
