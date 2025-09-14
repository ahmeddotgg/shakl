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

export interface PaddleProduct {
  id: string;
  title: string;
  quantity: number;
}

export interface PaddleTransaction {
  id: string;
  createdAt: string; // ISO string
  status: string;
  products: PaddleProduct[]; // product items + quantity
  amount: number; // major units (e.g. 652.15)
  currency: string; // e.g. "USD"
  method: string; // e.g. "VISA •••• 3184" or "card"
}

export async function fetchPaddleTransactions(
  userId: string
): Promise<PaddleTransaction[]> {
  const res = await fetch(
    `/api/get-transaction?userId=${encodeURIComponent(userId)}`
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "Failed to fetch");
    throw new Error(text || "Failed to fetch transactions");
  }
  return res.json();
}
