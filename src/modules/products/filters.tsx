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
  IconFilter,
  IconListNumbers,
  IconSortDescending,
} from "@tabler/icons-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { debounce } from "nuqs";
import { useFilters } from "./hooks/use-filters";
import type { Category, FileType } from "~/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export function Filters({
  categories,
  types,
}: {
  categories?: Category[];
  types?: FileType[];
}) {
  const [{ search }, setFilters] = useFilters();
  const isMobile = useIsMobile({ breakpoint: 845 });

  return (
    <div className="flex justify-between items-center gap-2">
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

      {isMobile ? (
        <Drawer>
          <DrawerTrigger
            asChild
            onClick={(e) => {
              e.currentTarget.blur();
            }}>
            <Button variant="outline">
              <IconFilter /> Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent className="container">
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>Customise your product view</DrawerDescription>
            </DrawerHeader>
            <Separator />
            <div className="flex justify-between py-12">
              <div className="flex flex-col items-start gap-6">
                <Label className={cn(buttonVariants({ variant: "link" }))}>
                  Show Items:
                </Label>
                <Label className={cn(buttonVariants({ variant: "link" }))}>
                  Category:
                </Label>
                <Label className={cn(buttonVariants({ variant: "link" }))}>
                  File Type:
                </Label>
                <Label className={cn(buttonVariants({ variant: "link" }))}>
                  Sort:
                </Label>
              </div>
              <FilterOptions
                classNames="flex flex-col gap-6 items-end"
                categories={categories}
                types={types}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <FilterOptions categories={categories} types={types} />
      )}
    </div>
  );
}

function FilterOptions({
  categories,
  types,
  classNames,
}: {
  categories?: Category[];
  types?: FileType[];
  classNames?: string;
}) {
  const [{ search, perPage, category, type, sort }, setFilters] = useFilters();
  const perPageOptions = [6, 12, 24];
  const sortOptions = ["Newest", "Oldest", "Low to High", "High to Low"];
  const isMobile = useIsMobile({ breakpoint: 845 });

  return (
    <div className={cn("flex flex-wrap gap-2", classNames)}>
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
        className={cn("max-w-fit", isMobile && "hidden")}
        onClick={() => setFilters(null)}>
        Reset
      </Button>
    </div>
  );
}
