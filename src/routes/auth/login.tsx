import { LoginForm } from "@/modules/auth/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: () => <LoginForm />,
});
