import { LoginForm } from "@/modules/auth/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: () => <LoginForm />,
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth?.user) {
      throw redirect({
        to: search.redirect,
      });
    }
  },
});
