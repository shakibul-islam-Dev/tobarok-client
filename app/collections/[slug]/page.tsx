import ShopPage from "@/components/shop/ShopPage";
import SlugPage from "@/components/shop/SlugPage";
import { collectionPages } from "@/lib/data";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = collectionPages[slug];

  if (!meta) {
    return (
      <SlugPage
        meta={undefined}
        crumbs={[{ label: "Collections", href: "/collections" }]}
      />
    );
  }

  return (
    <ShopPage
      title={meta.title}
      description={meta.description}
      products={meta.products}
      crumbs={[
        { label: "Collections", href: "/collections" },
        { label: meta.title },
      ]}
    />
  );
}
