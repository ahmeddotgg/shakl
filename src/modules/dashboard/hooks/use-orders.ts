import { useQuery } from "@tanstack/react-query";
import { fetchPaddleTransactions, type PaddleTransaction } from "../services";

export function usePaddleTransactions(userId?: string) {
  return useQuery<PaddleTransaction[], Error>({
    queryKey: ["paddle-transactions", userId],
    queryFn: () => fetchPaddleTransactions(userId!),
  });
}
