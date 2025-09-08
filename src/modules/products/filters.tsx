import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  IconCategory,
  IconFile,
  IconListNumbers,
  IconSortDescending,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { debounce } from "nuqs";
import { useFilters } from "./hooks/use-filters";
import type { Category, FileType } from "~/supabase";

export function Filters({
  categories,
  types,
}: {
  categories?: Category[];
  types?: FileType[];
}) {
  const [{ search, perPage, category, type, sort }, setFilters] = useFilters();
  const perPageOptions = [6, 12, 24];
  const sortOptions = ["Newest", "Oldest", "Low to High", "High to Low"];

  return (
    <div className="flex gap-2">
      <Input
        className="max-w-[200px]"
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setFilters(
            { search: e.target.value, page: 1 },
            {
              shallow: false,
              limitUrlUpdates: debounce(500),
            }
          )
        }
      />

      <Select
        value={perPage.toString()}
        onValueChange={(value) =>
          setFilters({ perPage: Number(value), page: 1 })
        }>
        <SelectTrigger>
          <IconListNumbers />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {perPageOptions.map((value) => (
            <SelectItem key={value} value={String(value)}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={category}
        onValueChange={(value) => setFilters({ category: value })}>
        <SelectTrigger>
          <IconCategory />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {categories?.map((value) => (
            <SelectItem key={value.id} value={value.name}>
              {value.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={type}
        onValueChange={(value) => setFilters({ type: value })}>
        <SelectTrigger>
          <IconFile />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {types?.map((value) => (
            <SelectItem key={value.id} value={value.name}>
              {value.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(value) => setFilters({ sort: value })}>
        <SelectTrigger>
          <IconSortDescending />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="secondary"
        disabled={
          !search &&
          perPage === 6 &&
          category === "All" &&
          type === "All" &&
          sort === "Newest"
        }
        onClick={() => setFilters(null)}>
        Reset
      </Button>
    </div>
  );
}
