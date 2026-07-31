import Link from "next/link";
import ShopPage from "@/components/shop/ShopPage";
import { ArrowRight } from "lucide-react";
import { collectionAllProducts, collectionPages } from "@/lib/data";

export default function Collections() {
  const links = Object.entries(collectionPages).map(([slug, meta]) => ({
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
              href={`/collections/${link.slug}`}
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
        title="Collections"
        description="Everything across the tobarok collections — pick a category chip above or browse it all."
        products={collectionAllProducts}
      />
    </div>
  );
}
