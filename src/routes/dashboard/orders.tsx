import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/modules/auth/hooks/use-auth";
import { usePaddleTransactions } from "@/modules/dashboard/hooks/use-orders";
import { TransactionsTable } from "@/modules/dashboard/orders-table";

export const Route = createFileRoute("/dashboard/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useUser();
  const { data, isLoading, error } = usePaddleTransactions(user?.id as string);

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  if (data) {
    return <TransactionsTable data={data.transactions} />;
  }
}
