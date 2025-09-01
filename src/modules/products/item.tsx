import { Button } from "@/components/ui/button";
import type { Product } from "../cart/item";
import { useCart } from "../cart/hooks/use-cart";
import { useWishlist } from "../cart/hooks/use-wishlist";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export const Item = ({ product }: { product: Product }) => {
  const { addItem: addToCart, items: cartItems } = useCart();
  const {
    addItem: addToWishlist,
    items: wishlistItems,
    removeItem: removeFromWishlist,
  } = useWishlist();

  const handleAddToWishlist = (product: Product) => {
    if (wishlistItems.some((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      key={product.id}
      className="flex flex-col gap-4 p-4 border rounded-xl h-full">
      <div className="rounded-2xl w-full aspect-[4/3] overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.description}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 className="font-semibold text-xl">{product.title}</h2>
        <p className="text-muted-foreground line-clamp-1">
          {product.description}
        </p>
        <p className="my-2 font-bold">${product.price.toFixed(2)}</p>
        <div className="flex gap-2">
          <Button
            onClick={() => addToCart(product)}
            disabled={cartItems.some((item) => item.id === product.id)}
            className="flex-1">
            Add to cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleAddToWishlist(product)}>
            <Heart
              className={cn(
                "fill-red-600 stroke-red-500 size-5",
                wishlistItems.some((item) => item.id === product.id)
                  ? "fill-red-700 stroke-red-700"
                  : "stroke-primary fill-none"
              )}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
