import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
  beforeLoad({ context }) {
    if (!context.auth?.user) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      Hello "/layout"!
      <Outlet />
    </div>
  );
}
