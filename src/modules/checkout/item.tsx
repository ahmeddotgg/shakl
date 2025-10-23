import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TransactionProduct } from "~/supabase/index";

interface Props {
  product: TransactionProduct;
}

export const Item = ({ product }: Props) => {
  return (
    <div className="relative flex gap-2 rounded-2xl bg-secondary/60 p-2">
      <img
        src={product.thumbnail_url}
        alt={product.title}
        className="size-28 rounded-xl object-cover"
      />

      <div className="flex flex-col">
        <h2 className="line-clamp-2 flex-1 font-semibold text-xs md:text-lg min-[325px]:text-sm">
          {product.title}
        </h2>

        <Button onClick={() => window.open(product.file_url, "_blank")}>
          <FileDown className="size-5" />
          <span className="hidden min-[290px]:inline">Download</span>
        </Button>
      </div>
    </div>
  );
};
