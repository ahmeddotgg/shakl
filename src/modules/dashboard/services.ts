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
