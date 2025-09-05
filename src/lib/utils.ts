import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product } from "./supabase-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTotal(items: Product[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
