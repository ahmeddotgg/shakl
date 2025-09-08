import {
  getCategories,
  getCategoryById,
  getFiletypeById,
  getFileTypes,
  getProductById,
  getProducts,
} from "@/modules/products/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct } from "@/modules/products/services";
import type { ProductInsert } from "~/supabase/index";
import { toast } from "sonner";

type UseProductsParams = {
  search: string;
  perPage: number;
  page: number;
  category: string;
  type: string;
  sort: string;
  categories: { id: string; name: string }[];
  fileTypes: { id: string; extension: string }[];
};

export function useProducts(params: UseProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    enabled: params.categories.length > 0 && params.fileTypes.length > 0,
  });
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
