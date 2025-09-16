import {
  supabase,
  type ProductInsert,
  type ProductView,
} from "~/supabase/index";

type GetProductsParams = {
  search: string;
  perPage: number;
  page: number;
  category: string;
  type: string;
  sort: string;
};

export async function getProducts(params: GetProductsParams) {
  const { search, perPage, page, category, type, sort } = params;

  const query = supabase
    .from("public_products")
    .select("*", { count: "exact" });

  if (search) query.ilike("title", `%${search}%`);

  if (category && category !== "All") {
    query.eq("category", category);
  }

  // Filter by file type name
  if (type && type !== "All") {
    query.eq("file_type", type);
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
  return { data: data as ProductView[], count };
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("public_products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as ProductView;
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

export async function getFileTypes() {
  const { data, error } = await supabase.from("file_types").select("*");
  if (error) throw error;
  return data;
}

export async function getCategoryByName(name: string) {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("name", name)
    .single();
  if (error) throw error;
  return data;
}

export async function getFiletypeByName(name: string) {
  const { data, error } = await supabase
    .from("file_types")
    .select("*")
    .eq("name", name)
    .single();
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
