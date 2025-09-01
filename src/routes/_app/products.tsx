import { useProducts } from "@/hooks/use-products";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: products, isPending } = useProducts();

  if (isPending) return <div>Loading...</div>;
  return (
    <div className="container">{products?.map((product) => product.title)}</div>
  );
}
