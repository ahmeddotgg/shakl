import { FileDown, Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { TransactionProduct } from "~/supabase/index";

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
    <div className="relative flex gap-2 rounded-2xl bg-secondary/60 p-2">
      <img
        src={product.thumbnail_url}
        alt={product.title}
        className="size-28 rounded-xl object-cover"
      />

      <div>
        <h2 className="line-clamp-2 font-semibold text-xs md:text-lg min-[325px]:text-sm">
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
