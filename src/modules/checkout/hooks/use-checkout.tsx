import { useMutation } from "@tanstack/react-query";
import { addOrderItems, createOrder } from "../services";
import { calculateTotal } from "@/lib/utils";
import type { Product } from "@/lib/supabase-client";

export function useCheckout() {
  return useMutation({
    mutationFn: async ({
      userId,
      items,
    }: {
      userId: string;
      items: Product[];
    }) => {
      const total = calculateTotal(items);
      const orderId = await createOrder(userId, total);
      await addOrderItems(orderId, items);
      return orderId;
    },
  });
}
