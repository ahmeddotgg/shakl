import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services";

export function useCategories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  return query;
}
