"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Product } from "@/lib/data";
import Breadcrumb, { type Crumb } from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/home/ProductCard";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

interface ShopPageProps {
  title: string;
  description?: string;
  products: Product[];
  crumbs?: Crumb[];
}

export default function ShopPage({
  title,
  description,
  products,
  crumbs = [],
}: ShopPageProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;
    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name":
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list;
    }
  }, [products, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={crumbs} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-neutral-500 sm:text-base">
              {description}
            </p>
          )}
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            {visibleProducts.length}{" "}
            {visibleProducts.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-52 rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium outline-none transition-colors focus:border-neutral-900"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-semibold text-neutral-900">
            No products found
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Try a different search term or clear your filters.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
