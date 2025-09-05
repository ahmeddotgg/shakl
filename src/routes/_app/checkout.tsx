import { Button } from "@/components/ui/button";
import { calculateTotal } from "@/lib/utils";
import { useUser } from "@/modules/auth/hooks/use-auth";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { Item } from "@/modules/cart/item";
import { useCheckout } from "@/modules/checkout/hooks/use-checkout";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/checkout")({
  component: RouteComponent,
  beforeLoad: ({ context: { auth }, location }) => {
    if (!auth?.user) {
      throw redirect({
        to: "/unauthenticated",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  head: () => ({
    meta: [
      {
        title: "Checkout | Shakl",
      },
    ],
  }),
});

function RouteComponent() {
  const { items: products, clearCart } = useCart();
  const { data: user } = useUser();
  const { mutate: createOrder, isPending } = useCheckout();

  const handleCheckout = async () => {
    if (!user) return;

    createOrder(
      { userId: user?.id, items: products },
      {
        onSuccess: () => {
          clearCart();
          toast.success("Order created successfully!");
        },
      }
    );
  };

  return (
    <div className="gap-6 grid grid-cols-1 min-[688px]:grid-cols-2 container">
      <div className="space-y-3">
        <h2 className="font-semibold">Order Products</h2>
        <div className="space-y-3">
          {products?.map((product) => (
            <Item type="cart" key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className="space-y-5">
        <h2 className="font-semibold">Order Summery</h2>

        <div>
          <p className="flex justify-between items-center font-semibold text-muted-foreground">
            Items:
            <span>{products.length}</span>
          </p>
          <p className="flex justify-between items-center font-bold text-2xl">
            Cart Total:
            <span className="text-lg">${calculateTotal(products)}</span>
          </p>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleCheckout}
          disabled={isPending || !products.length}>
          {isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingBag className="size-5" />
              Confirm Order
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
