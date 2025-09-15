import { Loading } from "@/components/shared/loading";
import { useTransaction } from "@/modules/checkout/hooks/use-checkout";
import { Item } from "@/modules/checkout/item";
import { createFileRoute } from "@tanstack/react-router";
import { CircleCheck, Loader } from "lucide-react";

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
        <div className="max-w-fit mx-auto flex justify-center flex-col items-center gap-8 bg-card p-14 border-2 rounded-lg">
          <Loader className="size-14 animate-spin" />
          <h2 className="text-2xl font-bold text-center text-balance">
            Processing Your Payment...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 container">
      <img
        src="/thankyou.svg"
        alt="thank you banner illustration design"
        className="max-w-md mx-auto"
      />

      <div className="text-center w-fit mx-auto">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          Your order has been confirmed{" "}
          <CircleCheck className="text-green-400" />
        </h2>
        <p className="text-sm text-muted-foreground">
          Download or access external files
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {data.products?.map((product) => (
          <Item product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
