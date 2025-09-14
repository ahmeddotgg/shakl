import {
  supabase,
  type RawTransaction,
  type Transaction,
  type TransactionProduct,
} from "~/supabase/index";

export async function getOrdersHistory(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  if (!data) return [];

  const transactions = (data as RawTransaction[]).map((t) => ({
    ...t,
    products: Array.isArray(t.products)
      ? (t.products as unknown as TransactionProduct[])
      : null,
  }));

  return transactions;
}
