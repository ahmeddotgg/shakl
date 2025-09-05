import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTotal<T extends { price: number }>(
  items: T[]
): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
