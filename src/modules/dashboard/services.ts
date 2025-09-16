import { supabase } from "~/supabase";
import type { Transaction } from "./orders-table";

export async function fetchPaddleTransactions(
  userId: string
): Promise<{ total: number; transactions: Transaction[] }> {
  const res = await fetch(
    `/api/get-transactions?userId=${encodeURIComponent(userId)}`
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "Failed to fetch");
    throw new Error(text || "Failed to fetch transactions");
  }
  return res.json();
}

export async function getProductsByUser(userId: string) {
  const { data, error } = await supabase
    .from("public_products")
    .select("*")
    .eq("created_by", userId);

  if (error) throw new Error(error.message);
  return data;
}
