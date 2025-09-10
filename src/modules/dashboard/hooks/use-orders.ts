import { useQuery } from "@tanstack/react-query";
import { getOrdersHistory } from "../services";

export const useOrdersHistory = (userId: string) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => getOrdersHistory(userId),
  });
};
