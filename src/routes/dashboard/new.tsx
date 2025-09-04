import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/modules/products/create-form";

export const Route = createFileRoute("/dashboard/new")({
  component: () => <ProductForm />,
});
