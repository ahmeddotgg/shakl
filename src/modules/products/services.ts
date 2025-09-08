import { supabase, type ProductInsert } from "~/supabase/index";

type GetProductsParams = {
  search: string;
  perPage: number;
  page: number;
  category: string;
  type: string;
  sort: string;
  categories: { id: string; name: string }[];
  fileTypes: { id: string; extension: string }[];
};

export async function getProducts(params: GetProductsParams) {
  const { search, perPage, page, category, type, sort, categories, fileTypes } =
    params;

  const query = supabase.from("products").select("*", { count: "exact" });

  if (search) query.ilike("title", `%${search}%`);

  if (category !== "All") {
    const catId = categories.find((c) => c.name === category)?.id;
    if (catId) query.eq("category_id", catId);
  }

  if (type !== "All") {
    const typeId = fileTypes.find((t) => t.extension === type)?.id;
    if (typeId) query.eq("file_type_id", typeId);
  }

  switch (sort) {
    case "Newest":
      query.order("created_at", { ascending: false });
      break;
    case "Oldest":
      query.order("created_at", { ascending: true });
      break;
    case "Low to High":
      query.order("price", { ascending: true });
      break;
    case "High to Low":
      query.order("price", { ascending: false });
      break;
  }

  query.range((page - 1) * perPage, page * perPage - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return { data, count };
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
