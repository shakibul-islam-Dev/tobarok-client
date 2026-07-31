import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShopPage from "@/components/shop/ShopPage";
import { budgetAllProducts, budgetPages } from "@/lib/data";

export default function Budget() {
  const links = Object.entries(budgetPages).map(([slug, meta]) => ({
    slug,
    title: meta.title,
  }));

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.slug}
              href={`/budget/${link.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              {link.title}
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </div>
      <ShopPage
        title="Budget Pick"
        description="Smart deals for smart shoppers — combos, bundles and flash sales."
        products={budgetAllProducts}
        crumbs={[{ label: "Budget Pick" }]}
      />
    </div>
  );
}
