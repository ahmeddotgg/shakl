import { supabase } from "@/lib/supabase-client";
import type { Database } from "@/lib/types";

export type ProductPayload = Database["public"]["Tables"]["products"]["Insert"];

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");
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

export async function createProduct(payload: ProductPayload) {
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("*");

  if (error) throw new Error(error.message);

  return data[0];
}
