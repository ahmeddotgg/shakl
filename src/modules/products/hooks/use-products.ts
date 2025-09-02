import { getProductById, getProducts } from "@/modules/products/services";

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
