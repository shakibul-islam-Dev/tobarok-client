import SlugPage from "@/components/shop/SlugPage";
import { budgetPages } from "@/lib/data";

export default async function BudgetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = budgetPages[slug];

  return (
    <SlugPage
      meta={meta}
      crumbs={[
        { label: "Budget Pick", href: "/budget" },
        { label: meta?.title ?? slug },
      ]}
    />
  );
}
