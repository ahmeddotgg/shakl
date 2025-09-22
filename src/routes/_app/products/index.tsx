import { createFileRoute } from "@tanstack/react-router";
import { Filters } from "@/modules/products/filters";
import { useFilters } from "@/modules/products/hooks/use-filters";
import {
  useCategories,
  useFileTypes,
  useProducts,
} from "@/modules/products/hooks/use-products";
import { Item } from "@/modules/products/item";
import { ProductsPagination } from "@/modules/products/products-pagination";

export const Route = createFileRoute("/_app/products/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Products | Shakl",
      },
    ],
  }),
});

function RouteComponent() {
  const [filters, setFilters] = useFilters();
  const { data: categoriesData = [] } = useCategories();
  const { data: fileTypesData = [] } = useFileTypes();

  const { data, isLoading } = useProducts({
    ...filters,
  });

  const products = data?.data || [];
  const total = data?.count || 0;
  const totalPages = Math.ceil(total / filters.perPage);

  return (
    <div className="container space-y-6">
      <h1 className="font-bold text-3xl">Explore our Products</h1>

      <Filters categories={categoriesData} types={fileTypesData} />

      {isLoading && <p>Loading...</p>}

      {!isLoading && data?.data?.length === 0 && <p>No products found.</p>}

      <div className="grid auto-rows-fr grid-cols-1 gap-4 lg:grid-cols-3 min-[530px]:grid-cols-2">
        {products?.map((product) => (
          <Item key={product.id} product={product} />
        ))}
      </div>

      <ProductsPagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(newPage) => setFilters({ page: newPage })}
      />
    </div>
  );
}
