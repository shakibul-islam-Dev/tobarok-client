import type { Metadata } from "next";
import StoreLocatorPage from "@/components/pages/StoreLocatorPage";

export const metadata: Metadata = {
  title: "Outlets | tobarok",
  description: "Find a tobarok store near you.",
};

export default function StoreLocator() {
  return <StoreLocatorPage />;
}
