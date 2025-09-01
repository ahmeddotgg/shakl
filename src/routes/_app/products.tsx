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
    <div className="gap-4 grid grid-cols-1 min-[530px]:grid-cols-2 lg:grid-cols-3 auto-rows-fr container">
      {products?.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  );
}
