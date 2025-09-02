import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/not-found")({
  component: () => (
    <div className="py-10 font-semibold text-2xl text-center">
      Product not found 😢
    </div>
  ),
});
