import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/modules/auth/register-form";

export const Route = createFileRoute("/auth/register")({
  component: () => <RegisterForm />,
  head: () => ({
    meta: [
      {
        title: "Register | Shakl",
      },
    ],
  }),
});
