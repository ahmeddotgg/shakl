import { type Database } from "@/lib/types";

export type Product = Database["public"]["Tables"]["products"]["Row"];

export const Item = ({ product }: { product: Product }) => {
  return (
    <div className="flex gap-2 bg-secondary/60 p-2 rounded-2xl">
      <img
        src={product.thumbnail}
        alt={product.description}
        className="rounded-xl size-24 object-cover"
      />

      <h2 className="text-xs min-[325px]:text-sm">{product.title}</h2>
    </div>
  );
};
