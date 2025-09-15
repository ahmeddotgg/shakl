import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/modules/auth/hooks/use-auth";
import { usePaddleTransactions } from "@/modules/dashboard/hooks/use-orders";

export const Route = createFileRoute("/dashboard/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useUser();
  const { data, isLoading, error } = usePaddleTransactions(user?.id as string);

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  console.log(data);
}
