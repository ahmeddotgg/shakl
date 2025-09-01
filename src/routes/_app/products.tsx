import { useProducts } from "@/modules/products/hooks/use-products";
import { Item } from "@/modules/products/item";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: products, isPending, isError } = useProducts();

  if (isError && !isPending) toast.error("Failed to load products");
  if (isPending) {
    return (
      <div className="font-semibold text-3xl text-center tracking-tight container">
        Loading...
      </div>
    );
  }

  return (
    <div className="container">
      {products?.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  );
}
