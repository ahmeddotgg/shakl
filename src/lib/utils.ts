import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProductView } from "~/supabase/index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTotal(items: ProductView[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
