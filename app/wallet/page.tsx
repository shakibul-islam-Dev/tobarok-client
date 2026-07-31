import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import WalletPage from "@/components/pages/WalletPage";

export const metadata: Metadata = {
  title: "Wallet | tobarok",
  description: "Your tobarok wallet balance and transactions.",
};

export default function Wallet() {
  return (
    <AuthRequired>
      <WalletPage />
    </AuthRequired>
  );
}
