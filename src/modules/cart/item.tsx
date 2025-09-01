import { type Database } from "@/lib/types";
import { CircleX } from "lucide-react";
import { useWishlist } from "./hooks/use-wishlist";
import { useCart } from "./hooks/use-cart";

export type Product = Database["public"]["Tables"]["products"]["Row"];

interface Props {
  product: Product;
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
        src={product.thumbnail}
        alt={product.description}
        className="rounded-xl size-24 object-cover"
      />

      <button
        onClick={() => handleRemoveItem(type)}
        className="top-0 right-0 absolute hover:bg-destructive rounded-full cursor-pointer">
        <CircleX className="size-4" />
      </button>

      <h2 className="text-xs min-[325px]:text-sm">{product.title}</h2>
    </div>
  );
};
