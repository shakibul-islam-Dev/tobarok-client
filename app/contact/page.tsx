import type { Metadata } from "next";
import ContactPage from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | tobarok",
  description: "Get in touch with the tobarok team.",
};

export default function Contact() {
  return <ContactPage />;
}
