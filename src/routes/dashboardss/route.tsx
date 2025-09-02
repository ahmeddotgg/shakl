import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboardss")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/layout"!
      <Outlet />
    </div>
  );
}
