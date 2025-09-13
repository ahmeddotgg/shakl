import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getTransactionByid } from "../services";

type Transaction = Awaited<ReturnType<typeof getTransactionByid>>;

export const useTransaction = (
  id: string,
  options?: Omit<UseQueryOptions<Transaction, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => getTransactionByid(id),
    ...options,
  });
};
