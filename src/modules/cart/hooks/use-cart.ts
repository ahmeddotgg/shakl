import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { Product } from "../item";

type CartStore = {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "cart-storage",
    }
  )
);
