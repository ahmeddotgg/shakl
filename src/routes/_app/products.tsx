import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { useProducts } from "@/modules/products/hooks/use-products";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: products, isPending, isError } = useProducts();
  const { addItem, items } = useCart();

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
        <div key={product.id} className="mb-4 p-4 border rounded-md">
          <div>
            <h2 className="font-semibold text-xl">{product.title}</h2>
            <p className="text-muted-foreground">{product.description}</p>
            <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
            <Button
              onClick={() => addItem(product)}
              disabled={items.some((item) => item.id === product.id)}
            >
              Add to cart
            </Button>
          </div>
          <img
            src={product.thumbnail}
            alt={product.slug || product.title}
            className="rounded-xl"
          />
        </div>
      ))}
    </div>
  );
}
