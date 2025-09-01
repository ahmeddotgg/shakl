import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { useWishlist } from "@/modules/cart/hooks/use-wishlist";
import { useProducts } from "@/modules/products/hooks/use-products";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/products")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: products, isPending, isError } = useProducts();
  const { addItem: addToCart, items: cartItems } = useCart();
  const { addItem: addToWishlist, items: wishlistItems } = useWishlist();

  if (isError && !isPending) toast.error("Failed to load products");
  if (isPending) {
    return (
      <div className="font-semibold text-3xl text-center tracking-tight container">
        Loading...
      </div>
    );
  }

  console.log(wishlistItems);

  return (
    <div className="container">
      {products?.map((product) => (
        <div key={product.id} className="mb-4 p-4 border rounded-md">
          <div>
            <h2 className="font-semibold text-xl">{product.title}</h2>
            <p className="text-muted-foreground">{product.description}</p>
            <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
            <Button
              onClick={() => addToCart(product)}
              disabled={cartItems.some((item) => item.id === product.id)}>
              Add to cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => addToWishlist(product)}
              disabled={wishlistItems.some((item) => item.id === product.id)}>
              <Heart className="size-5" />
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
