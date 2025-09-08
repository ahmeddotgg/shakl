import { Filters } from "@/modules/products/filters";
import { useFilters } from "@/modules/products/hooks/use-filters";
import {
  useCategories,
  useFileTypes,
  useProducts,
} from "@/modules/products/hooks/use-products";
import { Item } from "@/modules/products/item";
import { ProductsPagination } from "@/modules/products/products-pagination";
import { createFileRoute } from "@tanstack/react-router";

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
    categories: categoriesData,
    fileTypes: fileTypesData,
  });

  const products = data?.data || [];
  const total = data?.count || 0;
  const totalPages = Math.ceil(total / filters.perPage);

  return (
    <div className="space-y-6 container">
      <h1 className="font-bold text-3xl">Explore our Products</h1>
      <Filters categories={categoriesData} types={fileTypesData} />

      {isLoading && <p>Loading...</p>}

      {!isLoading && data?.data?.length === 0 && <p>No products found.</p>}

      <div className="gap-4 grid grid-cols-1 min-[530px]:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {products.map((product) => (
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
