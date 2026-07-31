import type { Metadata } from "next";
import TrackOrderPage from "@/components/pages/TrackOrderPage";

export const metadata: Metadata = {
  title: "Track Order | tobarok",
  description: "Track the delivery status of your tobarok order.",
};

export default function TrackOrder() {
  return <TrackOrderPage />;
}
