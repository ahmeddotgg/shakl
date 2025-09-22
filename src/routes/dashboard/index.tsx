import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/modules/auth/hooks/use-auth";
import { ProductsTable } from "@/modules/dashboard/products-table";
import { useProductsByUser } from "@/modules/products/hooks/use-products";
import type { ProductView } from "~/supabase";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useUser();

  const {
    data: products,
    isLoading,
    error,
  } = useProductsByUser(user?.id as string);

  if (isLoading) return <p>Loading Products...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  if (products) {
    return <ProductsTable data={products as ProductView[]} />;
  }
}
