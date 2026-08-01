import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AuthRequired from "@/components/shared/AuthRequired";
import OrderDetailPage from "@/components/pages/OrderDetailPage";
import { getOrderById } from "@/lib/order-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return { title: "Order Not Found | tobarok" };
  return {
    title: `Order ${order.id} | tobarok`,
    description: `Status: ${order.status}. View details for order ${order.id}.`,
  };
}

export default async function OrderDetail({ params }: PageProps) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) redirect("/orders");

  return (
    <AuthRequired>
      <OrderDetailPage order={order} />
    </AuthRequired>
  );
}
