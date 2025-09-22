import { CircleX } from "lucide-react";
import type { ProductView } from "~/supabase/index";
import { useCart } from "./hooks/use-cart";
import { useWishlist } from "./hooks/use-wishlist";

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
    <div className="relative flex gap-2 rounded-2xl bg-secondary/60 p-2">
      <img
        src={product.thumbnail_url}
        alt={product.description}
        className="size-28 rounded-xl object-cover"
      />

      <button
        type="button"
        onClick={() => handleRemoveItem(type)}
        className="-top-1 -left-1 absolute cursor-pointer rounded-full bg-secondary hover:bg-destructive"
      >
        <CircleX className="size-6" />
      </button>

      <div>
        <h2 className="line-clamp-2 font-semibold text-xs md:text-lg min-[325px]:text-sm">
          {product.title}
        </h2>

        <p className="my-2 font-bold text-lg">
          {product.price === 0 ? "Free" : `$${product.price.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
};
