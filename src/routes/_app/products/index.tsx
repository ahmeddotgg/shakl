import { getProductsQueryOptions } from "@/modules/products/hooks/use-products";
import { Item } from "@/modules/products/item";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getProductsQueryOptions());
  },
  head: () => ({
    meta: [
      {
        title: "Products | Shakl",
      },
    ],
  }),
});

function RouteComponent() {
  const { data: products } = useSuspenseQuery(getProductsQueryOptions());

  return (
    <div className="gap-4 grid grid-cols-1 min-[530px]:grid-cols-2 lg:grid-cols-3 auto-rows-fr container">
      {products?.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  );
}
