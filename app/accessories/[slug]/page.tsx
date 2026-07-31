import SlugPage from "@/components/shop/SlugPage";
import { accessoryPages } from "@/lib/data";

export default async function AccessoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = accessoryPages[slug];

  return (
    <SlugPage
      meta={meta}
      crumbs={[
        { label: "Accessories", href: "/accessories" },
        { label: meta?.title ?? slug },
      ]}
    />
  );
}
