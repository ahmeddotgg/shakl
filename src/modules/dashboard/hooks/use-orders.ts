import { useQuery } from "@tanstack/react-query";
import { fetchPaddleTransactions } from "../services";

export function usePaddleTransactions(userId?: string) {
  return useQuery<any[], Error>({
    queryKey: ["paddle-transactions", userId],
    queryFn: () => fetchPaddleTransactions(userId!),
  });
}
