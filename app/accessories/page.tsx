import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShopPage from "@/components/shop/ShopPage";
import { accessoryAllProducts, accessoryPages } from "@/lib/data";

export default function Accessories() {
  const links = Object.entries(accessoryPages).map(([slug, meta]) => ({
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
              href={`/accessories/${link.slug}`}
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
        title="Accessories"
        description="Caps, socks, bandanas, bags and sunglasses — the details that complete the fit."
        products={accessoryAllProducts}
        crumbs={[{ label: "Accessories" }]}
      />
    </div>
  );
}
