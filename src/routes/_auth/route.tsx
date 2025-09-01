import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth?.user) {
      toast.info("Already logged in, log out first.");
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="content-center min-h-svh container">
      <section className="bg-secondary/30 mx-auto p-8 border rounded-lg max-w-xl">
        <Outlet />
      </section>
    </div>
  );
}
