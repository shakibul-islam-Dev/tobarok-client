import SlugPage from "@/components/shop/SlugPage";
import { signaturePages } from "@/lib/data";

export default async function SignaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = signaturePages[slug];

  return (
    <SlugPage
      meta={meta}
      crumbs={[
        { label: "Signature Series", href: "/signature-series" },
        { label: meta?.title ?? slug },
      ]}
    />
  );
}
