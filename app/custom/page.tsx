import type { Metadata } from "next";
import CustomPage from "@/components/pages/CustomPage";

export const metadata: Metadata = {
  title: "Custom / Bulk | tobarok",
  description: "Order custom and bulk t-shirts from tobarok.",
};

export default function Custom() {
  return <CustomPage />;
}
