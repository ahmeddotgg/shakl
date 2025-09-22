import { createFileRoute } from "@tanstack/react-router";
import { CircleCheck, Loader } from "lucide-react";
import { Loading } from "@/components/shared/loading";
import { useTransaction } from "@/modules/checkout/hooks/use-checkout";
import { Item } from "@/modules/checkout/item";

type CheckoutIdParam = {
  checkout_id: string | undefined;
};

export const Route = createFileRoute("/_app/thankyou")({
  component: RouteComponent,
  validateSearch: (search: Record<string, undefined>): CheckoutIdParam => {
    return {
      checkout_id: search.checkout_id,
    };
  },
});

function RouteComponent() {
  const { checkout_id } = Route.useSearch();

  const { data, isLoading } = useTransaction(checkout_id || "", {
    refetchInterval: (q) =>
      q.state.data?.status === "confirmed" ? false : 2000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loading />;

  if (data?.status !== "confirmed") {
    return (
      <div className="container">
        <div className="mx-auto flex max-w-fit flex-col items-center justify-center gap-8 rounded-lg border-2 bg-card p-14">
          <Loader className="size-14 animate-spin" />
          <h2 className="text-balance text-center font-bold text-2xl">
            Processing Your Payment...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-8">
      <img
        src="/thankyou.svg"
        alt="thank you banner illustration design"
        className="mx-auto max-w-md"
      />

      <div className="mx-auto w-fit text-center">
        <h2 className="flex items-center gap-2 font-bold text-3xl">
          Your order has been confirmed{" "}
          <CircleCheck className="text-green-400" />
        </h2>
        <p className="text-muted-foreground text-sm">
          Download or access external files
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.products?.map((product) => (
          <Item product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
