import { useMutation } from "@tanstack/react-query";
import { createPaymentSession } from "../services";
import type { Product } from "@/lib/supabase-client";

export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: async ({
      amount,
      products,
    }: {
      amount: number;
      products: Product[];
    }) => {
      return createPaymentSession(amount, products);
    },
    onSuccess: (iframeUrl) => {
      window.location.href = iframeUrl;
    },
    onError: (error) => {
      console.error("Payment Error:", error);
      alert("Payment initialization failed");
    },
  });
}
