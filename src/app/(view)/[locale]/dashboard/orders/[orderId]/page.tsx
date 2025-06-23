import { OrderDetail } from "@/components/organisms/OrderDetail";

export default function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  if (!params.orderId || typeof params.orderId !== "string") {
    return <div>Error: Invalid User orderId</div>;
  }
  return <OrderDetail orderId={params.orderId} />;
}
