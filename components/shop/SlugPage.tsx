import { redirect } from "next/navigation";
import type { ShopMeta } from "@/lib/data";
import ShopPage from "./ShopPage";
import type { Crumb } from "@/components/ui/Breadcrumb";

interface SlugPageProps {
  meta: ShopMeta | undefined;
  crumbs?: Crumb[];
}

export default function SlugPage({ meta, crumbs = [] }: SlugPageProps) {
  if (!meta) redirect("/shop");
  return (
    <ShopPage
      title={meta.title}
      description={meta.description}
      products={meta.products}
      crumbs={crumbs}
    />
  );
}
