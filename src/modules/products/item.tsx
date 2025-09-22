import { Link } from "@tanstack/react-router";
import { Heart, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductView } from "~/supabase/index";
import { useCart } from "../cart/hooks/use-cart";
import { useWishlist } from "../cart/hooks/use-wishlist";

export const Item = ({ product }: { product: ProductView }) => {
  const { addItem: addToCart, items: cartItems } = useCart();
  const {
    addItem: addToWishlist,
    items: wishlistItems,
    removeItem: removeFromWishlist,
  } = useWishlist();

  const handleAddToWishlist = (product: ProductView) => {
    if (wishlistItems.some((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      key={product.id}
      className="flex h-full flex-col gap-4 rounded-xl border p-4"
    >
      <Link
        to="/products/$id"
        params={{
          id: product.id,
        }}
        className="aspect-[4/3] w-full overflow-hidden rounded-2xl"
      >
        <img
          src={product.thumbnail_url}
          alt={product.description}
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="space-y-3">
        <Link
          to="/products/$id"
          params={{
            id: product.id,
          }}
          className="line-clamp-1 font-semibold text-xl"
        >
          {product.title}
        </Link>
        <p className="line-clamp-1 text-muted-foreground">
          {product.description}
        </p>
        <p className="my-2 font-bold text-lg">
          {product.price === 0 ? "Free" : `$${product.price.toFixed(2)}`}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {!product ? (
              <div className="px-6">
                <Loader className="size-[13px] animate-spin" />
              </div>
            ) : (
              product.category
            )}
          </Badge>
          <Badge variant="secondary">
            {!product ? (
              <div className="px-6">
                <Loader className="size-[13px] animate-spin" />
              </div>
            ) : (
              product.file_type
            )}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => addToCart(product)}
            disabled={cartItems.some((item) => item.id === product.id)}
            className="flex-1"
          >
            Add to cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleAddToWishlist(product)}
          >
            <Heart
              className={cn(
                "size-5 fill-red-600 stroke-red-500",
                wishlistItems.some((item) => item.id === product.id)
                  ? "fill-red-400 stroke-red-400"
                  : "fill-none stroke-primary",
              )}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
