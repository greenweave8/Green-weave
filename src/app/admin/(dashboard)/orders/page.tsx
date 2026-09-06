import { getOrders } from "@/lib/db";
import OrdersManager from "@/components/admin/OrdersManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersManager orders={orders} />;
}