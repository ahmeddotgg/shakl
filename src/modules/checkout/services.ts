import { supabase, type TransactionProduct } from "~/supabase/index";

export async function getTransactionByid(id: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("checkout_id", id)
    .single();
  if (error) throw error;
  return {
    ...data,
    products: (data.products as TransactionProduct[] | null) ?? [],
  };
}
