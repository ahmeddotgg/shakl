import { RegisterForm } from "@/modules/auth/register-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register")({
  component: () => <RegisterForm />,
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
