import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import BillingAddressPage from "@/components/pages/BillingAddressPage";

export const metadata: Metadata = {
  title: "Billing Address | tobarok",
  description: "Manage your tobarok billing address.",
};

export default function BillingAddress() {
  return (
    <AuthRequired>
      <BillingAddressPage />
    </AuthRequired>
  );
}
