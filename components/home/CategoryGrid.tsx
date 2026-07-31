import Link from "next/link";
import { categories } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "./SectionHeading";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <SectionHeading
        title="Featured Categories"
        subtitle="From solid basics to signature drops — find the fit that defines you."
        link={{ label: "Shop All", href: "/shop" }}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.link}
            className="group relative block overflow-hidden rounded-xl bg-neutral-100"
          >
            <div className="aspect-[3/4] w-full">
              <SmartImage
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-3 text-sm font-bold text-white sm:text-base">
              {category.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
