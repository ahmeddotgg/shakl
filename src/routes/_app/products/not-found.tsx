import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/not-found")({
  component: () => (
    <div className="text-center font-semibold text-2xl">
      Product not found 😢
    </div>
  ),
});
