import { CircleX } from "lucide-react";
import { useWishlist } from "./hooks/use-wishlist";
import { useCart } from "./hooks/use-cart";
import type { ProductView } from "~/supabase/index";

interface Props {
  product: ProductView;
  type: "cart" | "wishlist";
}

export const Item = ({ product, type }: Props) => {
  const { removeItem: removeWishlistItem } = useWishlist();
  const { removeItem: removeCartItem } = useCart();

  const handleRemoveItem = (type: Props["type"]) => {
    if (type === "cart") {
      removeCartItem(product.id);
    } else {
      removeWishlistItem(product.id);
    }
  };

  return (
    <div className="relative flex gap-2 bg-secondary/60 p-2 rounded-2xl">
      <img
        src={product.thumbnail_url}
        alt={product.description}
        className="rounded-xl size-24 object-cover"
      />

      <button
        onClick={() => handleRemoveItem(type)}
        className="-top-1 -left-1 absolute bg-secondary hover:bg-destructive rounded-full cursor-pointer">
        <CircleX className="size-6" />
      </button>

      <div>
        <h2 className="text-xs min-[325px]:text-sm line-clamp-2">
          {product.title}
        </h2>
      </div>
    </div>
  );
};
