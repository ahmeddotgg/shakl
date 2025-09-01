import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/modules/products/services";

const PRODUCTS_KEY = ["products"];

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: getProducts,
  });
}
