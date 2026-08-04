/**
 * Client-side demo data for the admin panel, mapped into the backend API
 * shapes. Lets every admin page render from the data bundled on the client
 * instead of depending on a live backend, while still allowing a background
 * refresh when the API is reachable.
 */

import { heroSlides, outlets } from "./data";
import {
  initialOrders,
  initialProducts,
  productCategories,
  type AdminOrder,
  type AdminProduct,
} from "./admin-data";
import type {
  ApiCategory,
  ApiHeroSlide,
  ApiOutlet,
  ApiProduct,
} from "./admin-api";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function toApiProduct(p: AdminProduct): ApiProduct {
  return {
    _id: p.id,
    title: p.title,
    slug: slugify(p.title),
    image: p.image,
    price: p.price,
    category: p.category,
    stockQuantity: p.stock,
    inStock: p.stock > 0,
    isActive: p.status === "approved",
    createdAt: p.createdAt,
  };
}

export const demoProducts: ApiProduct[] = initialProducts.map(toApiProduct);

export const demoCategories: ApiCategory[] = productCategories.map(
  (title, i) => ({
    _id: `cat-${i + 1}`,
    title,
    slug: slugify(title),
    type: "collection",
    order: i,
    isActive: true,
  })
);

export const demoSlides: ApiHeroSlide[] = heroSlides.map((s, i) => ({
  _id: `slide-${s.id ?? i + 1}`,
  eyebrow: s.eyebrow,
  title: s.title,
  subtitle: s.subtitle,
  cta: s.cta,
  link: s.link,
  image: s.image,
  order: i,
  isActive: true,
}));

export const demoOutlets: ApiOutlet[] = outlets.map((o, i) => ({
  _id: `outlet-${i + 1}`,
  name: o.name,
  area: o.area,
  hours: o.hours,
  phone: o.phone,
  isActive: true,
}));

export interface DemoStats {
  products: number;
  categories: number;
  heroSlides: number;
  outlets: number;
  orders: number;
  users: number;
  lowStock: number;
  outOfStock: number;
}

export const demoStats: DemoStats = {
  products: initialProducts.length,
  categories: productCategories.length,
  heroSlides: heroSlides.length,
  outlets: outlets.length,
  orders: initialOrders.length,
  users: 0,
  lowStock: initialProducts.filter(
    (p) => p.stock > 0 && p.stock <= 5
  ).length,
  outOfStock: initialProducts.filter((p) => p.stock === 0).length,
};

export { initialOrders, type AdminOrder };
