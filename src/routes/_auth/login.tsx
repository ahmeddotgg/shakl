import { LoginForm } from "@/modules/auth/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: () => <LoginForm />,
});
