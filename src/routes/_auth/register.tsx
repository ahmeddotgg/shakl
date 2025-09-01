import { RegisterForm } from "@/modules/auth/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/register")({
  component: () => <RegisterForm />,
});
