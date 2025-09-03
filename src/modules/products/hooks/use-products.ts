import { getProductById, getProducts } from "@/modules/products/services";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/modules/products/services";
import type { Product } from "@/modules/products/services";

export function getProductsQueryOptions() {
  return {
    queryKey: ["products"],
    queryFn: getProducts,
  };
}

export function getProductQueryOptions(id: string) {
  return {
    queryKey: ["products", { id }],
    queryFn: () => getProductById(id),
  };
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: (payload: Product) => createProduct(payload),
  });
}
