import {
  getCategories,
  getCategoryById,
  getFiletypeById,
  getFileTypes,
  getProductById,
  getProducts,
  type Filters,
} from "@/modules/products/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct } from "@/modules/products/services";
import type { ProductInsert } from "@/supabase/index";
import { toast } from "sonner";

export function getProductsQueryOptions(filters?: Filters) {
  return {
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    keepPreviousData: true as const,
  };
}

export function getProductQueryOptions(id: string) {
  return {
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
  };
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: (payload: ProductInsert) => createProduct(payload),
    onSuccess: () => toast.success("Product Created 🎉"),
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

export const useFileTypeById = (id: string) => {
  return useQuery({
    queryKey: ["file_types", id],
    queryFn: () => getFiletypeById(id),
  });
};

export const useProductCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategoryById(id),
  });
};
