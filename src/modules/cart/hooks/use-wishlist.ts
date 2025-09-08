import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { Product } from "@/supabase/index";

type WishlistStore = {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) {
            return state;
          }
          toast.success("Item added to wishlist", {
            position: "bottom-right",
            richColors: false,
          });
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "wishlist-storage",
    }
  )
);
