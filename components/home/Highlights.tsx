import Link from "next/link";
import { highlights } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "./SectionHeading";

export default function Highlights() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <SectionHeading
          title="tobarok's Highlights"
          subtitle="The pieces everyone is talking about right now."
          link={{ label: "Explore More", href: "/shop" }}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {highlights.map((highlight, i) => (
            <Link
              key={highlight.title}
              href={highlight.link}
              className={`group relative block overflow-hidden rounded-xl bg-neutral-100 ${
                i === 0
                  ? "col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto"
                  : "aspect-square lg:aspect-auto lg:h-full"
              }`}
            >
              <SmartImage
                src={highlight.image}
                alt={highlight.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <p
                className={`absolute bottom-3 left-3 right-3 font-bold text-white ${
                  i === 0 ? "text-xl sm:text-2xl" : "text-sm sm:text-base"
                }`}
              >
                {highlight.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
