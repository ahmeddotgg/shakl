import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "../orders-table";
import { fetchPaddleTransactions } from "../services";

export function usePaddleTransactions(userId?: string) {
  return useQuery<{ total: number; transactions: Transaction[] }, Error>({
    queryKey: ["paddle-transactions", userId],
    queryFn: () => fetchPaddleTransactions(userId!),
  });
}
