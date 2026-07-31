import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShopPage from "@/components/shop/ShopPage";
import { signatureAllProducts, signaturePages } from "@/lib/data";

export default function SignatureSeries() {
  const links = Object.entries(signaturePages).map(([slug, meta]) => ({
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
              href={`/signature/${link.slug}`}
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
        title="Signature Series"
        description="Wear Bangladesh, Bangla Verse, Deshi Talk and more — pride printed on premium cotton."
        products={signatureAllProducts}
        crumbs={[{ label: "Signature Series" }]}
      />
    </div>
  );
}
