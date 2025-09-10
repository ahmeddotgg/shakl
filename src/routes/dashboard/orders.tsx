import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/modules/auth/hooks/use-auth";
import { useOrdersHistory } from "@/modules/dashboard/hooks/use-orders";

export const Route = createFileRoute("/dashboard/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useUser();
  const { data: orders, isLoading } = useOrdersHistory(user?.id as string);

  if (isLoading) return <div>Loading...</div>;

  return <div>{orders?.map((order) => JSON.stringify(order))}</div>;
}
