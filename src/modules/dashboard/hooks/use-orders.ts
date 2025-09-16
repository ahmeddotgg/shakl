import { useQuery } from "@tanstack/react-query";
import { fetchPaddleTransactions } from "../services";
import type { Transaction } from "../orders-table";

export function usePaddleTransactions(userId?: string) {
  return useQuery<{ total: number; transactions: Transaction[] }, Error>({
    queryKey: ["paddle-transactions", userId],
    queryFn: () => fetchPaddleTransactions(userId!),
  });
}
