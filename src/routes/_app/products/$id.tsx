import { getProductQueryOptions } from "@/modules/products/hooks/use-products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/$id")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    try {
      return await queryClient.ensureQueryData(getProductQueryOptions(id));
    } catch (error) {
      throw redirect({ to: "/products/not-found" });
    }
  },
});

function RouteComponent() {
  const id = Route.useParams().id;
  const { data: product } = useSuspenseQuery(getProductQueryOptions(id));

  return (
    <div className="container">
      <div className="space-y-3">
        <h1 className="font-bold text-2xl">{product?.title}</h1>
        <p className="text-muted-foreground text-sm">{product.description}</p>
      </div>
    </div>
  );
}
