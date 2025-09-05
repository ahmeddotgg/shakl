import { calculateTotal } from "@/lib/utils";
import { useCart } from "@/modules/cart/hooks/use-cart";
import { Item } from "@/modules/cart/item";
import { createFileRoute, redirect } from "@tanstack/react-router";

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
  const { items: products } = useCart();

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
      <div className="space-y-3">
        <h2 className="font-semibold">Order Summery</h2>

        <p className="flex justify-between items-center font-semibold">
          Items:
          <span className="text-lg">{products.length}</span>
        </p>
        <p className="flex justify-between items-center font-bold text-2xl">
          Cart Total:
          <span className="text-lg">${calculateTotal(products)}</span>
        </p>
      </div>
    </div>
  );
}
