import CreateProductForm from "@/modules/dashboard/create-product-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="font-bold text-2xl text-center">Create New Product</h1>
      <CreateProductForm />
    </div>
  );
}
