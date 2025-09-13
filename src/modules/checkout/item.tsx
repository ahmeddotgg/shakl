import type { TransactionProduct } from "~/supabase/index";
import { FileDown } from "lucide-react";

interface Props {
  product: TransactionProduct;
}

export const Item = ({ product }: Props) => {
  return (
    <div className="relative flex gap-2 bg-secondary/60 p-2 rounded-2xl">
      <img
        src={product.thumbnail_url}
        alt={product.title}
        className="rounded-xl size-28 object-cover"
      />

      <div>
        <h2 className="font-semibold text-xs min-[325px]:text-sm md:text-lg line-clamp-2">
          {product.title}
        </h2>

        <a
          href={product.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-primary font-medium">
          <FileDown className="size-5" strokeWidth={2.2} />
          <span className="hidden min-[290px]:inline">Download</span>
        </a>
      </div>
    </div>
  );
};
