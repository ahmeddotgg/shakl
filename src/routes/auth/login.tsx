import { LoginForm } from "@/modules/auth/login-form";
import { createFileRoute } from "@tanstack/react-router";
import type { UnauthenticatedSearch } from "../_app/unauthenticated";

export const Route = createFileRoute("/auth/login")({
  component: () => <LoginForm />,
  validateSearch: (search: Record<string, unknown>): UnauthenticatedSearch => {
    return {
      redirect: (search.redirect as string) || "",
    };
  },
  head: () => ({
    meta: [
      {
        title: "Login | Shakl",
      },
    ],
  }),
});
