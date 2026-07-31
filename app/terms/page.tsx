import type { Metadata } from "next";
import SimplePage from "@/components/pages/SimplePage";

export const metadata: Metadata = {
  title: "Terms & Conditions | tobarok",
};

export default function Terms() {
  return (
    <SimplePage
      title="Terms & Conditions"
      crumbs={[{ label: "Terms & Conditions" }]}
    >
      <div className="max-w-3xl space-y-4">
        <p>
          These terms govern your use of the tobarok website and your
          purchases from us. By placing an order, you agree to these terms.
        </p>
        {[
          {
            h: "1. Orders",
            b: "All orders are subject to product availability. We reserve the right to cancel any order due to stock issues and will issue a full refund in such cases.",
          },
          {
            h: "2. Pricing",
            b: "Prices are listed in Bangladeshi Taka (৳) and may change without notice. The price charged is the one displayed at checkout.",
          },
          {
            h: "3. Delivery",
            b: "Delivery timelines are estimates. Dhaka deliveries typically arrive within 24–72 hours; outside Dhaka, 3–5 business days.",
          },
          {
            h: "4. Returns & Exchanges",
            b: "Unworn items with tags intact can be exchanged within 7 days of delivery. Clearance sale items are non-returnable.",
          },
          {
            h: "5. Liability",
            b: "We are not liable for delays caused by courier services or circumstances beyond our reasonable control.",
          },
        ].map((section) => (
          <div key={section.h}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              {section.h}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
              {section.b}
            </p>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}
