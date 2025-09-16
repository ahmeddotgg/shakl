import {
  getCategories,
  getCategoryByName,
  getFiletypeByName,
  getFileTypes,
  getProductById,
  getProducts,
} from "@/modules/products/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct } from "@/modules/products/services";
import type { ProductInsert } from "~/supabase/index";
import { toast } from "sonner";
import { getProductsByUser } from "@/modules/dashboard/services";

type UseProductsParams = {
  search: string;
  perPage: number;
  page: number;
  category: string;
  type: string;
  sort: string;
};

export function useProducts(params: UseProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
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

export const useFileTypeByName = (name: string) => {
  return useQuery({
    queryKey: ["file_types", name],
    queryFn: () => getFiletypeByName(name),
  });
};

export const useProductCategoryByName = (name: string) => {
  return useQuery({
    queryKey: ["categories", name],
    queryFn: () => getCategoryByName(name),
  });
};

export const useProductsByUser = (userId: string) => {
  return useQuery({
    queryKey: ["products", userId],
    queryFn: () => getProductsByUser(userId),
  });
};
