import type { Metadata } from "next";
import SimplePage from "@/components/pages/SimplePage";

export const metadata: Metadata = {
  title: "About Us | tobarok",
  description: "The story behind tobarok — made with pride in Bangladesh.",
};

export default function About() {
  return (
    <SimplePage title="About Us" crumbs={[{ label: "About" }]}>
      <section className="max-w-3xl">
        <p>
          tobarok started with a simple belief: great quality tees shouldn&apos;t
          cost a fortune. What began as a small drop-shoulder lineup has grown
          into one of Bangladesh&apos;s most-loved streetwear brands.
        </p>
        <p>
          Every piece is made with premium cotton, precise stitching and a fit
          that&apos;s built for real life — from busy Dhaka mornings to weekend
          hangouts. We design bold, we price honestly, and we ship across the
          country with cash on delivery.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Premium Quality",
            body: "Combed cotton, reinforced seams and colours that hold wash after wash.",
          },
          {
            title: "Honest Prices",
            body: "Big drops and budget picks without the markup. Quality should be fair.",
          },
          {
            title: "Built With Pride",
            body: "Designed and produced in Bangladesh, worn across the country.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl bg-neutral-50 p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {item.body}
            </p>
          </div>
        ))}
      </section>
    </SimplePage>
  );
}
