import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/products"!</div>;
}
