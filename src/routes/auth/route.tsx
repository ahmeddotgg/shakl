import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
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
