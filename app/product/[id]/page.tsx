import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProductPage from "@/components/product/ProductPage";
import { allProducts, getProduct } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) return { title: "Product Not Found | tobarok" };
  return {
    title: `${product.title} | tobarok`,
    description: `${product.title} — ${product.badge ?? "Premium quality"} at tobarok. Free delivery on orders over ৳1,500.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProduct(Number(id));

  if (!product) redirect("/shop");

  const related = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductPage product={product} related={related} />;
}
