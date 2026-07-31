"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/lib/data";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  link?: { label: string; href: string };
  products: Product[];
  align?: "left" | "center";
}

export default function ProductCarousel({
  title,
  subtitle,
  link,
  products,
  align = "left",
}: ProductCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollByDir = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className={align === "center" ? "mx-auto text-center" : ""}>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 max-w-xl text-sm text-neutral-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {link && (
            <Link
              href={link.href}
              className="group mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:text-neutral-500"
            >
              {link.label}
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByDir(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByDir(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:gap-4"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[45%] min-w-[180px] snap-start sm:w-[230px] sm:min-w-[230px] lg:w-[255px] lg:min-w-[255px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
