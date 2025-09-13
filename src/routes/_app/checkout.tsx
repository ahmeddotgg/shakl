import { Button } from "@/components/ui/button";
import { calculateTotal } from "@/lib/utils";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { Item } from "@/modules/cart/item";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2, ShoppingBag } from "lucide-react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/modules/auth/hooks/use-auth";

export const Route = createFileRoute("/_app/checkout")({
  component: RouteComponent,
  beforeLoad: ({ context: { auth }, location }) => {
    if (!auth) {
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
  const { items: products } = useCart();
  const [paddle, setPaddle] = useState<Paddle>();
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: import.meta.env.VITE_PADDLE_CLIENT,
      eventCallback: async (event) => {
        const status = event.data?.status;
        if (status === "completed" && user?.id) {
          await fetch("/api/save-transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              checkout_id: event.data?.id,
              user_id: user.id,
              payload: event.data,
            }),
          });

          navigate({ to: `/thankyou?checkout_id=${event.data?.id}` });
        }
      },
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, [user]);

  const openCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });

      const data = await res.json();
      const transactionId = data.transaction;

      paddle?.Checkout.open({
        transactionId: transactionId,
        settings: {
          theme: "dark",
          showAddTaxId: false,
        },
        customer: {
          email: user?.email as string,
        },
      });

      if (!res.ok || data) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error(`Error creating transaction: ${error.message}`);
      }
    }
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
          onClick={openCheckout}
          disabled={loading || !products.length}>
          {loading ? (
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
