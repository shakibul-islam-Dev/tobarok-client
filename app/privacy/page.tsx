import type { Metadata } from "next";
import SimplePage from "@/components/pages/SimplePage";

export const metadata: Metadata = {
  title: "Privacy Policy | tobarok",
};

export default function Privacy() {
  return (
    <SimplePage
      title="Privacy Policy"
      crumbs={[{ label: "Privacy Policy" }]}
    >
      <div className="max-w-3xl space-y-4">
        <p>
          Your privacy matters to us. This policy explains what we collect and
          how we use it.
        </p>
        {[
          {
            h: "1. Data We Collect",
            b: "We collect the information you provide at checkout (name, phone, address, email) and basic usage data to improve the site.",
          },
          {
            h: "2. How We Use It",
            b: "Your information is used to process orders, arrange delivery, provide support and (with consent) send promotional updates.",
          },
          {
            h: "3. Payment Security",
            b: "We do not store card details. Payments are processed through trusted gateways. Cash on delivery orders keep your payment entirely offline.",
          },
          {
            h: "4. Sharing",
            b: "We only share your delivery details with courier partners to fulfil your order. We never sell your data.",
          },
          {
            h: "5. Your Rights",
            b: "You may request access to or deletion of your personal data at any time by contacting hello@tobarok.com.",
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
