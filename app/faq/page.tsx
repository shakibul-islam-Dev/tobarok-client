import type { Metadata } from "next";
import FaqPage from "@/components/pages/FaqPage";

export const metadata: Metadata = {
  title: "FAQs | tobarok",
  description: "Answers to the most common questions about tobarok.",
};

export default function Faq() {
  return <FaqPage />;
}
