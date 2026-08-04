import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import EarnPage from "@/components/pages/EarnPage";

export const metadata: Metadata = {
  title: "Watch Ads & Earn | tobarok",
  description:
    "Watch short sponsored ads and earn points straight into your tobarok wallet. Spend your points on anything in the store.",
};

export default function Earn() {
  return (
    <AuthRequired>
      <EarnPage />
    </AuthRequired>
  );
}
