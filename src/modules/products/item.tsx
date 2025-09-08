import { Button } from "@/components/ui/button";
import { useCart } from "../cart/hooks/use-cart";
import { useWishlist } from "../cart/hooks/use-wishlist";
import { Heart, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { Product } from "~/supabase/index";
import { useFileTypeById, useProductCategoryById } from "./hooks/use-products";
import { Badge } from "@/components/ui/badge";

export const Item = ({ product }: { product: Product }) => {
  const { addItem: addToCart, items: cartItems } = useCart();
  const {
    addItem: addToWishlist,
    items: wishlistItems,
    removeItem: removeFromWishlist,
  } = useWishlist();

  const { data: category, isPending: loadingCategory } = useProductCategoryById(
    product.category_id
  );
  const { data: fileType, isPending: loadingFileType } = useFileTypeById(
    product.file_type_id
  );

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
      <Link
        to="/products/$id"
        params={{
          id: product.id,
        }}
        className="rounded-2xl w-full aspect-[4/3] overflow-hidden">
        <img
          src={product.thumbnail_url}
          alt={product.description}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="space-y-3">
        <Link
          to="/products/$id"
          params={{
            id: product.id,
          }}
          className="font-semibold text-xl line-clamp-1">
          {product.title}
        </Link>
        <p className="text-muted-foreground line-clamp-1">
          {product.description}
        </p>
        <p className="my-2 font-bold text-lg">
          {product.price === 0 ? "Free" : product.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {loadingCategory ? (
              <div className="px-6">
                <Loader className="size-[13px] animate-spin" />
              </div>
            ) : (
              category?.name
            )}
          </Badge>
          <Badge variant="secondary">
            {loadingFileType ? (
              <div className="px-6">
                <Loader className="size-[13px] animate-spin" />
              </div>
            ) : (
              fileType?.name
            )}
          </Badge>
        </div>
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
                  ? "fill-red-400 stroke-red-400"
                  : "stroke-primary fill-none"
              )}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
