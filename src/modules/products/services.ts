import { supabase, type ProductInsert } from "~/supabase/index";

export interface Filters {
  categoryId?: string;
  isFree?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "created_at" | "name";
  orderBy?: "asc" | "desc";
  limit?: number;
  offset?: number;
}
export async function getProducts(filter?: Filters) {
  let query = supabase.from("products").select("*");

  if (filter?.categoryId) {
    query = query.eq("category_id", filter.categoryId);
  }
  if (filter?.isFree) {
    query = query.eq("price", filter.isFree && 0);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProduct(payload: ProductInsert) {
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("*");

  if (error) throw new Error(error.message);

  return data[0];
}

export async function getCategories() {
  const { data, error } = await supabase.from("product_categories").select("*");
  if (error) throw error;
  return data;
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getFiletypeById(id: string) {
  const { data, error } = await supabase
    .from("file_types")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getFileTypes() {
  const { data, error } = await supabase.from("file_types").select("*");
  if (error) throw error;
  return data;
}

export async function imageUpload(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(`${fileName}`, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Failed to get public URL");
  }

  return publicUrlData.publicUrl;
}

export async function incrementProductDownloadCount(productId: string) {
  const { error } = await supabase.rpc("increment_download_count", {
    product_id: productId,
  });
  if (error) throw new Error(error.message);
}
