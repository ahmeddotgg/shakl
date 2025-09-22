import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export function useFilters() {
  return useQueryStates({
    search: parseAsString.withDefault(""),
    perPage: parseAsInteger.withDefault(6),
    page: parseAsInteger.withDefault(1),
    category: parseAsString.withDefault("All"),
    type: parseAsString.withDefault("All"),
    sort: parseAsString.withDefault("Newest"),
  });
}
