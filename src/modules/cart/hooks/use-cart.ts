import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { Database } from "@/lib/types";
import { calculateTotal } from "@/lib/utils";
import {
  addOrderItems,
  createOrderInDB,
  incrementProductDownloadCount,
} from "../services";

export type Product = Database["public"]["Tables"]["products"]["Row"];

type CartStore = {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  createOrder: (
    userId: string
  ) => Promise<{ success: boolean; orderId?: string }>;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) {
            return state;
          }
          toast.info("Item added to cart", {
            position: "bottom-right",
            richColors: false,
          });
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      createOrder: async (userId) => {
        const items = get().items;
        if (items.length === 0) return { success: false };

        const total = calculateTotal(items);

        try {
          const orderId = await createOrderInDB(userId, total);

          await addOrderItems(
            orderId,
            items.map((i) => ({ productId: i.id, price: i.price }))
          );

          for (const item of items) {
            await incrementProductDownloadCount(item.id);
          }

          set({ items: [] });
          return { success: true, orderId };
        } catch (error) {
          console.error(error);
          return { success: false };
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
