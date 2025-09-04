import {
  getCategories,
  getFileTypes,
  getProductById,
  getProducts,
} from "@/modules/products/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct } from "@/modules/products/services";
import type { NewProductInsert } from "../create-form";

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
    mutationFn: (payload: NewProductInsert) => createProduct(payload),
  });
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export const useFileTypes = () => {
  return useQuery({
    queryKey: ["file_types"],
    queryFn: getFileTypes,
  });
};
