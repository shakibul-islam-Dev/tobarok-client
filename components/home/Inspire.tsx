import Link from "next/link";
import { inspire } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";

export default function Inspire() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="mb-7 flex flex-col items-center text-center">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
          Wear to inspire
        </h2>
        <p className="mt-2 max-w-md text-sm text-neutral-500">
          Dressed in tobarok — bold, real and built with pride.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {inspire.map((item) => (
          <Link
            key={item.label}
            href={item.link}
            className="group relative block overflow-hidden rounded-xl bg-neutral-100"
          >
            <div className="aspect-[4/5] w-full">
              <SmartImage
                src={item.image}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <span className="text-sm font-bold text-white">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
