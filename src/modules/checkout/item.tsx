import type { TransactionProduct } from "~/supabase/index";
import { FileDown, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  product: TransactionProduct;
}

export const Item = ({ product }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      const res = await fetch("/api/increment-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error("Failed to increment download count:", data.error);
        return;
      }
      setDisabled(true);
      window.open(product.file_url, "_blank");
    } catch (err) {
      console.error("Request failed:", err);
    } finally {
      setLoading(false);
    }
  };

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

        <Button onClick={handleDownload} disabled={loading || disabled}>
          {loading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <FileDown className="size-5" />
          )}
          <span className="hidden min-[290px]:inline">Download</span>
        </Button>
      </div>
    </div>
  );
};
