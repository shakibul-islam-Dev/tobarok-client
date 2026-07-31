import type { Metadata } from "next";
import SimplePage from "@/components/pages/SimplePage";

export const metadata: Metadata = {
  title: "Return Policy | tobarok",
};

export default function Returns() {
  return (
    <SimplePage
      title="Return Policy"
      crumbs={[{ label: "Return Policy" }]}
    >
      <div className="max-w-3xl space-y-4">
        <p>
          We want you to love what you ordered. If something isn&apos;t right,
          here&apos;s how exchanges work.
        </p>
        {[
          {
            h: "Eligibility",
            b: "Items must be unworn, unwashed and in original condition with all tags attached, within 7 days of delivery.",
          },
          {
            h: "How to Request",
            b: "Contact us via the Contact page or WhatsApp with your order ID and the reason for exchange. We'll arrange a pickup or guide you to the nearest store.",
          },
          {
            h: "Exchanges",
            b: "We'll exchange for a different size or colour subject to stock. If your size is unavailable, we'll issue store credit or a refund.",
          },
          {
            h: "Non-Returnable",
            b: "Clearance/sale items and products marked as final sale cannot be exchanged.",
          },
          {
            h: "Defective Items",
            b: "If you receive a defective item, report it within 48 hours of delivery with photos. We'll replace it free of charge.",
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
